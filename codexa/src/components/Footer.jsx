import { Sparkles, Code2, MessageCircle } from 'lucide-react';

const Github = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const footerLinks = {
  Product: [
    { label: 'Learn', href: '#learn' },
    { label: 'AI Tutor', href: '#ai-tutor' },
    { label: 'Premium', href: '#premium' },
    { label: 'Roadmap', href: '#roadmap' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Premium Programs', href: '#premium' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & description */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 text-text" aria-label="Codexa home">
              <img src="/favicon-32x32.png" alt="Codexa Logo" className="h-7 w-7 rounded-md" />
              <span className="font-heading text-base font-semibold tracking-tight">Codexa</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Interactive learning for developers. Stop reading, start experiencing.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/iamsouvik007/CODEXA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-card hover:text-text"
                aria-label="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-card hover:text-text"
                aria-label="Community"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 font-mono text-xs tracking-wide text-text-muted uppercase">{category}</h3>
              <ul role="list" className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Codexa. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built with ❤️ by Souvik.
          </p>
        </div>
      </div>
    </footer>
  );
}
