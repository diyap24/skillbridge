'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router   = useRouter();
  const pathname = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu when pathname changes - handled via Link onClick

  const navLinks = [
    { href: '/challenges', label: 'Challenges' },
    { href: '/skills',     label: 'Skills' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/85 backdrop-blur-xl border-b border-royal/20 shadow-2xl shadow-void/60'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal to-mauve
                            flex items-center justify-center shadow-royal
                            group-hover:shadow-mauve transition-shadow duration-300">
              <span className="text-cream text-xs font-black">SB</span>
            </div>
            <span className="font-black text-[15px] tracking-tight text-cream">
              Skill<span className="text-mauve">Bridge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200
                               ${active ? 'text-cream' : 'text-blush/60 hover:text-cream'}`}>
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2
                                     w-4 h-0.5 bg-gradient-to-r from-royal to-mauve rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/profile"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-royal to-mauve
                             flex items-center justify-center text-cream text-xs font-black
                             shadow-royal hover:shadow-mauve ring-2 ring-mauve/20
                             hover:ring-mauve/50 transition-all duration-300">
                  {user?.fullName?.[0]?.toUpperCase()}
                </Link>
                <button onClick={() => { clearAuth(); router.push('/'); }}
                  className="text-xs text-blush/40 hover:text-blush/80 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm text-blush/60 hover:text-cream transition-colors font-medium">
                  Sign in
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-royal to-mauve
                             text-cream text-sm font-semibold shadow-royal
                             hover:shadow-mauve hover:-translate-y-px transition-all duration-200">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10
                       rounded-lg hover:bg-royal/20 transition-colors">
            <span className={`w-5 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300
                              ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300
                              ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-cream rounded-full mx-auto transition-all duration-300
                              ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300
                       ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-void/95 backdrop-blur-xl"
             onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-16 inset-x-0 border-b border-royal/20
                         bg-void/95 backdrop-blur-xl transition-all duration-300
                         ${mobileOpen ? 'translate-y-0' : '-translate-y-3'}`}>
          <div className="px-6 py-6 space-y-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl
                               text-sm font-medium transition-colors duration-200
                               ${active ? 'bg-royal/30 text-cream' : 'text-blush/60 hover:text-cream hover:bg-royal/15'}`}>
                  {label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-mauve" />}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-royal/15 mt-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 px-4">
                  <Link href="/profile"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-royal to-mauve
                               flex items-center justify-center text-cream text-sm font-black">
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
                  <Link href="/login"
                    className="flex-1 py-3 text-center rounded-xl border border-royal/30
                               text-blush/60 text-sm font-medium hover:bg-royal/15 transition-colors">
                    Sign in
                  </Link>
                  <Link href="/register"
                    className="flex-1 py-3 text-center rounded-xl
                               bg-gradient-to-r from-royal to-mauve text-cream text-sm font-semibold">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
