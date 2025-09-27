import { Metadata } from 'next';
import LoginForm from '@/frontend/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion Admin - WebCraft',
  description: 'Interface de connexion administration WebCraft',
  robots: 'noindex, nofollow',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">WebCraft Admin</h1>
        <p className="text-slate-400">Connectez-vous pour accéder au dashboard</p>
      </div>
      
      <LoginForm />
    </div>
  );
}
