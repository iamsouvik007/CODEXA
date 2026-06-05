import { Sparkles, Code2, MessageCircle } from 'lucide-react';

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
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading text-base font-semibold tracking-tight">Codexa</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Interactive learning for developers. Stop reading, start experiencing.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-card hover:text-text"
                aria-label="GitHub"
              >
                <Code2 className="h-4 w-4" />
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
            Built with passion for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
