import { Metadata } from 'next';
import { ClientAuthProvider } from '@/frontend/contexts/ClientAuthContext';

export const metadata: Metadata = {
  title: 'Espace Client - WebCraft',
  description: 'Votre espace client WebCraft - Gérez vos projets et demandes',
  robots: 'noindex, nofollow', // Empêcher l'indexation de l'espace client
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <div className="min-h-screen bg-slate-900">
        {children}
      </div>
    </ClientAuthProvider>
  );
}
