import { notFound } from 'next/navigation';
import VerifyClient from './VerifyClient';

async function getCred(token: string) {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${url}/credentials/verify/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const cred = await getCred(token);
  if (!cred) notFound();
  return <VerifyClient cred={cred} />;
}