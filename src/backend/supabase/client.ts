/**
 * Client Supabase pour le navigateur (côté client)
 * Utilise les clés publiques, compatible avec les composants React
 */

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/shared/types/database';

// Variables d'environnement publiques (safe côté client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validation des variables d'environnement
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL manquante dans .env.local');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY manquante dans .env.local');
}

// Création du client Supabase typé
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Hook pour obtenir l'utilisateur connecté côté client
 * Utiliser dans les composants React
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Erreur récupération utilisateur:', error);
    return null;
  }
  
  return user;
}

/**
 * Hook pour écouter les changements d'authentification
 * Utiliser dans les composants qui ont besoin de réagir aux connexions/déconnexions
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}

/**
 * Connexion utilisateur
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { user: data.user, error };
}

/**
 * Déconnexion utilisateur
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Types exports pour les composants
 */
export type { Database } from '@/shared/types/database';
