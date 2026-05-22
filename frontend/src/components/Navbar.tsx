'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-blue-600">Skill</span>
          <span className="text-xl font-bold text-slate-800">Bridge</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/challenges"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Challenges
          </Link>
          <Link href="/skills"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Skills
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
                                justify-center text-white text-sm font-bold">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link href="/register"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg
                           hover:bg-blue-700 transition-colors font-medium">
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
