'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { 
  ClientAuthentifie, 
  ClientAuthResponse, 
  ClientLoginForm, 
  ClientRegistrationForm,
  ClientProfile 
} from '../../shared/types/client';

export function useClientAuth() {
  const [client, setClient] = useState<ClientAuthentifie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Charger le client au montage
  useEffect(() => {
    loadClient();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadClient();
        } else if (event === 'SIGNED_OUT') {
          setClient(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadClient = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setClient(null);
        return;
      }

      // Récupérer les données client depuis notre table
      const response = await fetch('/api/client/profile', {
        credentials: 'include' // Important pour inclure les cookies
      });

      if (response.ok) {
        const clientData = await response.json();
        setClient(clientData.client);
      } else {
        setClient(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du client:', error);
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: ClientLoginForm): Promise<ClientAuthResponse> => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        const errorMessage = authError.message === 'Invalid login credentials' 
          ? 'Email ou mot de passe incorrect'
          : 'Erreur de connexion';
        
        setError(errorMessage);
        return { success: false, error: { code: authError.message, message: errorMessage } };
      }

      if (data.session) {
        await loadClient();
        return { success: true, session: data.session };
      }

      return { success: false, error: { code: 'no_session', message: 'Erreur de connexion' } };
    } catch (error) {
      const errorMessage = 'Erreur de connexion';
      setError(errorMessage);
      return { success: false, error: { code: 'unknown', message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: ClientRegistrationForm): Promise<ClientAuthResponse> => {
    try {
      setError(null);
      setLoading(true);

      // 1. Créer le compte Supabase Auth
      console.log('🔐 [DEBUG] Tentative création compte:', {
        email: data.email,
        passwordLength: data.password?.length,
        nom: data.nom,
        prenom: data.prenom,
        entreprise: data.entreprise
      });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nom: data.nom,
            prenom: data.prenom,
            entreprise: data.entreprise
          }
        }
      });
      
      console.log('🔐 [DEBUG] Réponse Supabase:', { authData, authError });

      if (authError) {
        const errorMessage = authError.message === 'User already registered' 
          ? 'Un compte existe déjà avec cet email'
          : 'Erreur lors de la création du compte';
        
        setError(errorMessage);
        return { success: false, error: { code: authError.message, message: errorMessage } };
      }

      // 2. Créer le profil client dans notre table
      if (authData.user) {
        const response = await fetch('/api/client/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_user_id: authData.user.id,
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
            entreprise: data.entreprise,
            telephone: data.telephone,
            secteur_activite: data.secteur_activite,
            commune: data.commune,
            source_inscription: 'direct',
            accepte_conditions: data.accepte_conditions,
            accepte_newsletter: data.accepte_newsletter
          }),
        });

        if (!response.ok) {
          // Si erreur création profil, supprimer le compte auth
          await supabase.auth.signOut();
          throw new Error('Erreur lors de la création du profil');
        }

        const clientData = await response.json();
        
        return { 
          success: true, 
          client: clientData.client,
          session: authData.session 
        };
      }

      return { success: false, error: { code: 'no_user', message: 'Erreur de création' } };
    } catch (error) {
      const errorMessage = 'Erreur lors de la création du compte';
      setError(errorMessage);
      return { success: false, error: { code: 'unknown', message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setClient(null);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateProfile = async (profileData: Partial<ClientProfile>): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const response = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important pour inclure les cookies
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        await loadClient(); // Recharger les données
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  };

  const refreshClient = async (): Promise<void> => {
    await loadClient();
  };

  return {
    client,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshClient,
    isAuthenticated: !!client,
    isEmailVerified: client?.email_verifie || false
  };
}
