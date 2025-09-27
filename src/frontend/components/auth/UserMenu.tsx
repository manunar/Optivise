'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut, onAuthStateChange } from '@/backend/supabase/client';
import { Button, Avatar, AvatarFallback, LogOut, User } from '@/frontend/components';

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Charger l'utilisateur au montage
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      // Nettoyer l'abonnement
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Chargement...</div>;
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        className="border-slate-700 text-slate-300"
        onClick={() => router.push('/auth/login')}
      >
        Connexion
      </Button>
    );
  }

  // Extraire les initiales de l'email
  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 bg-amber-600 text-white">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-slate-300 text-sm hidden md:inline-block">
          {user.email}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden md:inline">Déconnexion</span>
      </Button>
    </div>
  );
}
