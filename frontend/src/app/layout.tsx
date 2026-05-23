import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavbarWrapper } from '@/components/NavbarWrapper';
import { MeshBackground } from '@/components/MeshBackground';

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
          <MeshBackground />
          <NavbarWrapper />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
