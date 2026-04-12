import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'SESD Full Stack Task Management Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <header className="border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              TaskFlow
            </h1>
            <nav className="space-x-4 text-sm font-medium text-slate-300">
              <span>Admin Board</span>
              <span>Developer View</span>
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
