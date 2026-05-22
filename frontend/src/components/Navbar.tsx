'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { clearAuth(); router.push('/'); };

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${scrolled ? 'glass shadow-2xl shadow-void/80' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal to-mauve
                          flex items-center justify-center shadow-lg shadow-royal/50
                          group-hover:shadow-mauve/60 group-hover:scale-110
                          transition-all duration-300">
            <span className="text-cream text-sm font-black">S</span>
          </div>
          <span className="font-black text-lg tracking-tight">
            <span className="text-cream">Skill</span>
            <span className="bg-gradient-to-r from-mauve to-blush bg-clip-text text-transparent">
              Bridge
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/challenges', label: 'Challenges' },
            { href: '/skills',     label: 'Skills' },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200
                ${isActive(href)
                  ? 'text-cream bg-royal/40 shadow-inner'
                  : 'text-blush/60 hover:text-cream hover:bg-royal/20'}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive('/dashboard')
                    ? 'text-cream bg-royal/40'
                    : 'text-blush/60 hover:text-cream hover:bg-royal/20'}`}>
                Dashboard
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-royal to-mauve
                                flex items-center justify-center text-cream text-sm font-black
                                shadow-lg shadow-royal/40 ring-2 ring-mauve/30
                                hover:ring-mauve/60 transition-all duration-300 cursor-default">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
                <button onClick={handleLogout}
                  className="text-xs text-blush/40 hover:text-blush/80
                             transition-colors duration-200 font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm text-blush/60 hover:text-cream
                           transition-colors duration-200 font-medium px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
