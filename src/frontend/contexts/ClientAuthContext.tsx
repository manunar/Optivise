'use client';

import React, { createContext, useContext } from 'react';
import { useClientAuth } from '@/frontend/hooks/useClientAuth';
import type { ClientAuthContext as ClientAuthContextType } from '@/shared/types/client';

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useClientAuth();

  return (
    <ClientAuthContext.Provider value={auth}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuthContext(): ClientAuthContextType {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuthContext must be used within a ClientAuthProvider');
  }
  return context;
}

// Hook simplifié pour vérifier l'authentification
export function useIsClientAuthenticated(): boolean {
  const { isAuthenticated } = useClientAuthContext();
  return isAuthenticated;
}

// Hook pour obtenir le client actuel
export function useCurrentClient() {
  const { client, loading } = useClientAuthContext();
  return { client, loading };
}
