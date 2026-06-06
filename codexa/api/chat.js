export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, apiKey, messages, systemPrompt, testConnectionOnly } = req.body;

  if (!provider) {
    return res.status(400).json({ error: 'Missing provider parameter' });
  }

  // Resolve API Key
  let resolvedKey = apiKey || '';
  const isMock = !resolvedKey || resolvedKey.trim().toLowerCase().includes('mock') || resolvedKey.trim().toLowerCase().includes('test');

  if (isMock) {
    const envKeyMap = {
      openai: process.env.OPENAI_API_KEY,
      nvidia: process.env.NVIDIA_API_KEY,
      groq: process.env.GROQ_API_KEY,
      claude: process.env.CLAUDE_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
    };
    const envKey = envKeyMap[provider];
    if (envKey) {
      resolvedKey = envKey;
    }
  }

  // If still mock or empty, return mock responses
  if (!resolvedKey || resolvedKey.trim().toLowerCase().includes('mock') || resolvedKey.trim().toLowerCase().includes('test')) {
    if (testConnectionOnly) {
      return res.status(200).json({ success: true, mock: true });
    }
    const lastUserMsg = messages?.[messages.length - 1]?.text || '';
    return res.status(200).json({ text: getMockResponse(lastUserMsg) });
  }

  const trimmedKey = resolvedKey.trim();

  try {
    if (testConnectionOnly) {
      const success = await performTestConnection(provider, trimmedKey);
      return res.status(200).json({ success });
    }

    const text = await performCall(provider, trimmedKey, messages, systemPrompt);
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Server-side API proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

async function performTestConnection(provider, trimmedKey) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    let response;
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${trimmedKey}`;
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say ok' }] }],
          generationConfig: { maxOutputTokens: 5 }
        }),
        signal: controller.signal
      });
    } else if (provider === 'claude') {
      const url = `https://api.anthropic.com/v1/messages`;
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': trimmedKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Say ok' }]
        }),
        signal: controller.signal
      });
    } else {
      const base =
        provider === 'openai' ? 'https://api.openai.com/v1' :
        provider === 'nvidia' ? 'https://integrate.api.nvidia.com/v1' :
        'https://api.groq.com/openai/v1';
      const url = `${base}/chat/completions`;
      const model =
        provider === 'openai' ? 'gpt-4o-mini' :
        provider === 'nvidia' ? 'meta/llama-3.1-8b-instruct' :
        'llama3-8b-8192';

      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${trimmedKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Say ok' }],
          max_tokens: 5
        }),
        signal: controller.signal
      });
    }
    clearTimeout(id);
    return response.ok;
  } catch (err) {
    clearTimeout(id);
    console.error('Test connection API proxy error:', err);
    return false;
  }
}

async function performCall(provider, trimmedKey, messages, systemPrompt) {
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : msg.role,
    content: msg.text
  }));

  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${trimmedKey}`;
    const contents = [];
    if (systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `[System Instructions]\n${systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow those instructions.' }] });
    }
    for (const msg of formattedMessages) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  let url = '';
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${trimmedKey}`,
  };
  let body = {};

  switch (provider) {
    case 'openai':
      url = 'https://api.openai.com/v1/chat/completions';
      body = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'nvidia':
      url = 'https://integrate.api.nvidia.com/v1/chat/completions';
      body = {
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'groq':
      url = 'https://api.groq.com/openai/v1/chat/completions';
      body = {
        model: 'llama3-8b-8192',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'claude':
      url = 'https://api.anthropic.com/v1/messages';
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': trimmedKey,
        'anthropic-version': '2023-06-01',
      };
      body = {
        model: 'claude-3-5-haiku-20241022',
        system: systemPrompt,
        messages: formattedMessages,
        max_tokens: 1024
      };
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  if (provider === 'claude') {
    return data.content[0]?.text || '';
  } else {
    return data.choices[0]?.message?.content || '';
  }
}

function getMockResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('analogy')) {
    return `Here is a real-world analogy for you:
    
Think of variables like storage boxes in a warehouse.
* **Primitive variables** (like numbers or booleans) are small items that fit directly inside the box. When you copy them, you duplicate the item.
* **Objects and Arrays** are large machines. They don't fit inside the box. Instead, the box contains a piece of paper with the GPS address (reference) of where the machine is kept in the main room. When you copy it, you copy the address paper, so both boxes point to the exact same machine!`;
  }

  if (q.includes('debug') || q.includes('error')) {
    return `Let's debug this code together!
    
Common causes of errors in your active scope:
1. **ReferenceError**: Make sure you declared the variable using \`let\` or \`const\` before accessing it.
2. **TypeError**: Double check if you are trying to reassign a \`const\` variable, e.g.:
\`\`\`javascript
const pi = 3.14;
pi = 3.15; // ❌ TypeError: Assignment to constant variable.
\`\`\`
To fix it, change the declaration to \`let\`.`;
  }

  if (q.includes('quiz')) {
    return `Here is a practice quiz question for you!
    
**Question**: What is the output of the following code?
\`\`\`javascript
let x = 10;
const run = () => {
  console.log(x);
  let x = 20;
};
run();
\`\`\`
* A) \`10\`
* B) \`20\`
* C) \`ReferenceError\` (Temporal Dead Zone)
* D) \`undefined\`
*Think about where the variable is declared and try to answer!*`;
  }

  if (q.includes('interview')) {
    return `Here is a typical interview question and how to answer it:
    
**Q: Explain the Temporal Dead Zone (TDZ) in JavaScript.**
**Answer**:
The TDZ is the phase between the entering of a block scope and the actual line where a \`let\` or \`const\` variable is declared. Accessing the variable during this time throws a \`ReferenceError\`.
Unlike \`var\` which is hoisted as \`undefined\`, \`let\` and \`const\` are hoisted but not initialized, so they cannot be accessed until their declaration statement is executed.`;
  }

  if (q.includes('summar')) {
    return `### Lesson Summary:
    
* **Scope**: Scope defines where variables are accessible in your code. JavaScript uses lexical scope, meaning nested functions can access variables defined in their outer parent scopes.
* **TDZ**: The period of time where a \`let\`/\`const\` variable is hoisted but cannot be accessed until initialized.
* **Strict Equality**: Always use \`===\` to check for both value and type equality without implicit type conversion.`;
  }

  return `I'm your Codexa AI Tutor, currently operating with a **demo/mock key**. 

I'm ready to help you learn! Here are some things you can ask me:
1. **Explain Concept** — "Explain scope and closures in detail."
2. **Give Analogy** — "Give me an analogy for JavaScript variables."
3. **Practice Question** — "Give me a practice challenge."
4. **Interview Prep** — "What are some interview questions on loops?"
5. **Debug Help** — "How do I fix standard syntax errors?"

> 💡 **Tip**: To connect a real AI, click the ⚙️ settings icon and enter a **Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com)) — Gemini works in the browser without CORS issues!`;
}
