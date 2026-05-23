'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  const isEditorPage = /^\/challenges\/[^/]+$/.test(pathname);
  if (isEditorPage) return null;
  return <Navbar />;
}
