import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavbarWrapper } from '@/components/NavbarWrapper';
// 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillBridge — Verify Your Skills',
  description: 'Earn verifiable credentials by solving real coding challenges',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#190019' }}>
        <Providers>
          <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 20% 20%, rgba(82,43,91,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(43,18,76,0.4) 0%, transparent 60%), #190019", pointerEvents: "none" }} />
          <NavbarWrapper />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
