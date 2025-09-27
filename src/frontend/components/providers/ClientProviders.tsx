'use client';

import { Suspense } from 'react';
import { ClientAuthProvider } from '@/frontend/contexts/ClientAuthContext';

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  try {
    return (
      <ClientAuthProvider>
        {children}
      </ClientAuthProvider>
    );
  } catch (error) {
    console.error('Erreur ClientAuthProvider:', error);
    // Fallback sans authentification
    return <>{children}</>;
  }
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AuthProviderWrapper>
        {children}
      </AuthProviderWrapper>
    </Suspense>
  );
}
