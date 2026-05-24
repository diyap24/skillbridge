'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { href: '/challenges', label: 'Challenges' },
    { href: '/skills',     label: 'Skills' },
    { href: '/jobs',       label: 'Jobs' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      {/* Floating pill nav */}
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className={`pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full
          border border-royal transition-all duration-300
          ${scrolled
            ? 'bg-deep/98 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl'
            : 'bg-deep/90 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl'}`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-1 pr-3 group flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-grad-btn shadow-royal flex items-center justify-center
                            group-hover:shadow-mauve transition-shadow duration-300">
              <span className="text-cream text-[10px] font-bold tracking-tight">SB</span>
            </div>
            <span className="font-semibold text-[13px] text-cream tracking-tight hidden sm:block">
              Skill<span className="text-mauve">Bridge</span>
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-royal mx-1 hidden md:block" />

          {/* Nav links */}
          <div className="hidden md:flex items-center">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200
                    ${active
                      ? 'text-cream'
                      : 'text-blush/55 hover:text-cream hover:bg-royal/60'}`}>
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-mauve rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-royal mx-1 hidden md:block" />

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-1.5 pr-1">
            {isAuthenticated ? (
              <>
                <Link href="/profile"
                  className="w-7 h-7 rounded-full bg-grad-btn flex items-center justify-center
                             text-cream text-[11px] font-bold shadow-royal hover:shadow-mauve
                             ring-2 ring-mauve/20 hover:ring-mauve/50 transition-all duration-300">
                  {user?.fullName?.[0]?.toUpperCase()}
                </Link>
                <button onClick={() => { clearAuth(); router.push('/'); }}
                  className="text-[12px] text-blush/40 hover:text-blush/80 px-2 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="px-3 py-1.5 text-[13px] text-blush/55 hover:text-cream transition-colors font-medium">
                  Sign in
                </Link>
                <Link href="/register"
                  className="px-4 py-1.5 rounded-full bg-grad-btn text-cream text-[13px] font-semibold
                             shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                             transition-all duration-200 active:translate-y-0">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-9 h-9 rounded-full
                       hover:bg-royal/50 transition-colors mr-1">
            <span className={`w-4 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-4 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300
                       ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-void/80 backdrop-blur-sm"
             onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-20 left-4 right-4 rounded-2xl border border-royal
                         bg-deep/98 backdrop-blur-xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)]
                         transition-all duration-300 ${mobileOpen ? 'translate-y-0' : '-translate-y-3'}`}>
          <div className="space-y-1 mb-4">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl
                               text-sm font-medium transition-colors duration-200
                               ${active ? 'bg-mauve/15 text-cream' : 'text-blush/60 hover:text-cream hover:bg-royal/40'}`}>
                  {label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-mauve" />}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-royal pt-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-4">
                <Link href="/profile" onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full bg-grad-btn flex items-center justify-center text-cream text-sm font-bold">
                  {user?.fullName?.[0]?.toUpperCase()}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-sm font-semibold truncate">{user?.fullName}</p>
                  <p className="text-blush/40 text-xs truncate">{user?.email}</p>
                </div>
                <button onClick={() => { clearAuth(); router.push('/'); }}
                  className="text-xs text-blush/40 hover:text-blush transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl border border-royal text-blush/60 text-sm font-medium hover:bg-royal/40 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl bg-grad-btn text-cream text-sm font-semibold shadow-royal">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
