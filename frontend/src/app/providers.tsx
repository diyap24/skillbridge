'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2B124C',
            color: '#FBE4D8',
            border: '1px solid rgba(133,79,108,0.35)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#854F6C', secondary: '#FBE4D8' } },
          error:   { iconTheme: { primary: '#854F6C', secondary: '#FBE4D8' } },
        }}
      />
    </QueryClientProvider>
  );
}
