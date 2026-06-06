/**
 * Provider-agnostic AI client for Codexa.
 * Supports OpenAI, NVIDIA NIM, Groq, and Claude.
 * Keeps keys secure on the user's device.
 */

// Helper to determine endpoints based on localhost proxy
const getApiBase = (provider) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  switch (provider) {
    case 'openai':
      return isLocalhost ? '/api-openai' : 'https://api.openai.com/v1';
    case 'nvidia':
      return isLocalhost ? '/api-nvidia' : 'https://integrate.api.nvidia.com/v1';
    case 'groq':
      return isLocalhost ? '/api-groq' : 'https://api.groq.com/openai/v1';
    case 'claude':
      return isLocalhost ? '/api-claude' : 'https://api.anthropic.com/v1';
    default:
      return '';
  }
};

/**
 * Validates the API key format based on selected provider rules.
 */
export function validateKeyFormat(provider, apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return false;
  const trimmed = apiKey.trim();
  if (trimmed.length < 10) return false;

  // If testing with mock key, pass validation
  if (trimmed.toLowerCase().includes('mock') || trimmed.toLowerCase().includes('test')) {
    return true;
  }

  switch (provider) {
    case 'openai':
      // sk-... or sk-proj-...
      return trimmed.startsWith('sk-');
    case 'nvidia':
      // nvapi-...
      return trimmed.startsWith('nvapi-');
    case 'groq':
      // gsk_...
      return trimmed.startsWith('gsk_');
    case 'claude':
      // sk-ant-...
      return trimmed.startsWith('sk-ant-');
    default:
      return false;
  }
}

/**
 * Tests connection to the selected provider by making a minimal request.
 */
export async function testConnection(provider, apiKey) {
  const trimmedKey = apiKey.trim();
  
  // If it's a mock key, bypass network and succeed after simulated delay
  if (trimmedKey.toLowerCase().includes('mock') || trimmedKey.toLowerCase().includes('test')) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  }

  const base = getApiBase(provider);
  let url = '';
  let headers = { 'Content-Type': 'application/json' };
  let body = {};

  switch (provider) {
    case 'openai':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say ok' }],
        max_tokens: 5
      };
      break;
    case 'nvidia':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: 'Say ok' }],
        max_tokens: 5
      };
      break;
    case 'groq':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: 'Say ok' }],
        max_tokens: 5
      };
      break;
    case 'claude':
      url = `${base}/messages`;
      headers['x-api-key'] = trimmedKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Say ok' }]
      };
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(id);
    return response.ok;
  } catch (error) {
    clearTimeout(id);
    console.error('API Verification error:', error);
    // If we run into a CORS issue or network block, return false.
    return false;
  }
}

/**
 * Call the configured AI provider.
 */
export async function callAIProvider(provider, apiKey, messages, systemPrompt) {
  const trimmedKey = apiKey.trim();

  // Handle mock responses
  if (trimmedKey.toLowerCase().includes('mock') || trimmedKey.toLowerCase().includes('test')) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    return getMockResponse(lastUserMsg);
  }

  const base = getApiBase(provider);
  let url = '';
  let headers = { 'Content-Type': 'application/json' };
  let body = {};

  // Map messages to API format: role 'ai' -> 'assistant', property 'text' -> 'content'
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : msg.role,
    content: msg.text
  }));

  switch (provider) {
    case 'openai':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'nvidia':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'groq':
      url = `${base}/chat/completions`;
      headers['Authorization'] = `Bearer ${trimmedKey}`;
      body = {
        model: 'llama3-8b-8192',
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages]
      };
      break;
    case 'claude':
      url = `${base}/messages`;
      headers['x-api-key'] = trimmedKey;
      headers['anthropic-version'] = '2023-06-01';
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
    headers: headers,
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

/**
 * Returns a educational mock response for demo keys.
 */
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

  // Default response
  return `I'm your Codexa AI Tutor, currently operating with a **demo/mock key**. 

I'm ready to help you learn! Here are some things you can ask me:
1. **Explain Concept** — "Explain scope and closures in detail."
2. **Give Analogy** — "Give me an analogy for JavaScript variables."
3. **Practice Question** — "Give me a practice challenge."
4. **Interview Prep** — "What are some interview questions on loops?"
5. **Debug Help** — "How do I fix standard syntax errors?"`;
}
