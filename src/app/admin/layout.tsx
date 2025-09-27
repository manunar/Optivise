import { Metadata } from 'next';
import UserMenu from '@/frontend/components/auth/UserMenu';
import { redirect } from 'next/navigation';
import { getServerUserInternal } from '@/backend/supabase/server';

export const metadata: Metadata = {
  title: 'Administration - WebCraft',
  description: 'Interface d\'administration WebCraft',
  robots: 'noindex, nofollow', // Empêcher l'indexation
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifier l'authentification côté serveur
  const userInternal = await getServerUserInternal();
  
  // Si non connecté, rediriger vers la page de login
  if (!userInternal) {
    redirect('/auth/login');
  }
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Admin */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">WebCraft Admin</h1>
            <nav className="flex space-x-4">
              <a 
                href="/admin/dashboard" 
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard Audit
              </a>
              {/* Autres liens admin futurs */}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}