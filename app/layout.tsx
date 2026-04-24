import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Synapse',
  description: 'SESD Full Stack Task Management Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-violet-500/20" />
              <h1 className="text-xl font-black tracking-tight text-white">
                Synapse
              </h1>
            </div>
            <nav className="flex items-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="hover:text-violet-400 cursor-pointer transition-colors">Infrastructure</span>
              <span className="hover:text-violet-400 cursor-pointer transition-colors">Deployment</span>
              <span className="hover:text-violet-400 cursor-pointer transition-colors">Team</span>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
