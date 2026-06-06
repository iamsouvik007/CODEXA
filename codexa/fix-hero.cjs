const fs = require('fs');

const file = 'd:/Hackathon/Hackathon1/codexa/src/components/Hero.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newBottom = `        {/* Hero code preview card */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-16 max-w-3xl sm:mt-20"
        >
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-bg-card/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(249,115,22,0.15)]"
          >
            {/* Localized cursor-reactive glow */}
            <div
              className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: 'radial-gradient(400px circle at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%), rgba(249,115,22,0.08), transparent 40%)',
              }}
              aria-hidden="true"
            />
            {/* Inner reflection */}
            <div className="pointer-events-none absolute inset-0 z-10 rounded-xl border border-white/5" aria-hidden="true" />

            <div className="relative z-20">
              {/* Editor title bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]/90 shadow-[0_0_10px_rgba(255,95,87,0.4)]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]/90 shadow-[0_0_10px_rgba(254,188,46,0.4)]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]/90 shadow-[0_0_10px_rgba(40,200,64,0.4)]" />
                </div>
                <span className="ml-2 font-mono text-xs text-text-muted">codexa.js</span>
              </div>
              {/* Code content */}
              <div className="p-6 sm:p-8">
                <pre className="text-left font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
                  <code>
                    <span className="text-text-muted">{'// 🚀 The Codexa learning pipeline\\n\\n'}</span>
                    <span className="text-[#c084fc]">const</span>{' '}
                    <span className="text-[#67e8f9]">learn</span>{' = {\\n'}
                    {'  '}
                    <span className="text-text">concept</span>
                    {'   : '}
                    <span className="text-[#a5f3fc]">{"\\"Understand the idea\\""}</span>
                    {',\\n  '}
                    <span className="text-text">analogy</span>
                    {'   : '}
                    <span className="text-[#a5f3fc]">{"\\"Connect to what you know\\""}</span>
                    {',\\n  '}
                    <span className="text-text">visualize</span>
                    {' : '}
                    <span className="text-[#a5f3fc]">{"\\"See it come alive\\""}</span>
                    {',\\n  '}
                    <span className="text-text">practice</span>
                    {'  : '}
                    <span className="text-[#a5f3fc]">{"\\"Write real code\\""}</span>
                    {',\\n  '}
                    <span className="text-text">master</span>
                    {'    : '}
                    <span className="text-[#a5f3fc]">{"\\"Prove your knowledge\\""}</span>
                    {'\\n};\\n\\n'}
                    <span className="text-accent">{'learn'}</span>
                    <span className="text-text-muted">.start()</span>
                    {'  '}
                    <span className="text-text-muted">{'// → Begin your journey'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-text-muted">
            <span>✦ Interactive lessons</span>
            <span>✦ Live code editor</span>
            <span>✦ AI mentor</span>
            <span className="hidden sm:inline">✦ Visual explanations</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
`;

// Slice off everything from line 191 (index 190) onwards, and append our new block.
const updatedLines = lines.slice(0, 190);
updatedLines.push(newBottom);

fs.writeFileSync(file, updatedLines.join('\n'));
console.log('Hero.jsx fixed successfully!');
