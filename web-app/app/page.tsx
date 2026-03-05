'use client';

import { useEffect, useState } from 'react';
import ContactForm from '@/components/ContactForm';
import LinkTree from '@/components/LinkTree';
import Shop from '@/components/Shop';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function Home() {
  const { name, colors } = useSiteConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[var(--color-dark-bg)] text-white selection:bg-[var(--color-neon-pink)] selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 cyber-grid opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-dark-bg)]/40 to-[var(--color-dark-bg)]" />
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-[var(--color-neon-pink)]/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-sky-blue)]/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 w-full animate-in fade-in zoom-in duration-700">
          <LinkTree />
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-24 pb-24">
        {/* Shop Section */}
        <section id="tienda" className="scroll-mt-16">
          <Shop />
        </section>

        {/* Contact Section */}
        <section id="contacto" className="scroll-mt-16 glass-card p-1 md:p-6 border-dashed border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-pink)]/5 via-transparent to-[var(--color-sky-blue)]/5" />
          <div className="max-w-2xl mx-auto relative z-10">
            <ContactForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
            <p className="font-black text-[8px] uppercase tracking-[0.4em] text-white/20">© {new Date().getFullYear()} {name} SYSTEM_CORE</p>
            <div className="h-0.5 w-12 bg-[var(--color-neon-pink)] opacity-40" />
          </div>
          <div className="flex gap-8 font-bold uppercase text-[9px] tracking-[0.3em] text-white/30">
            {['Telegram', 'WhatsApp', 'Instagram'].map(social => (
              <a key={social} href="#" className="hover:text-[var(--color-neon-cyan)] hover:tracking-[0.5em] transition-all duration-500">{social}</a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
