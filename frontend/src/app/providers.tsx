'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#131316',
            color: '#C9C9CF',
            border: '1px solid #26262B',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#FF4F00', secondary: '#131316' } },
          error:   { iconTheme: { primary: '#FF4F00', secondary: '#131316' } },
        }}
      />
    </QueryClientProvider>
  );
}
