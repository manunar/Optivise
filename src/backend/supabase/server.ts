/**
 * Client Supabase pour le serveur (côté backend)
 * Utilise la service role key pour les opérations privilégiées
 * ⚠️ À utiliser UNIQUEMENT côté serveur (API routes, Server Components)
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database, UtilisateurInterne } from '@/shared/types/database';
import type { AuthenticatedUser } from './utils';

// Variables d'environnement serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validation des variables d'environnement
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL manquante dans .env.local');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
}

/**
 * Client Supabase pour les opérations serveur avec authentification
 * Utilise les cookies pour maintenir la session utilisateur
 * ⚠️ Respecte encore les RLS policies
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore dans certains contextes (middleware)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore dans certains contexts
          }
        },
      },
    }
  );
}

/**
 * Client Supabase avec privilèges administrateur
 * ⚠️ BYPASS TOUTES LES RLS POLICIES
 * À utiliser avec précaution pour les opérations système
 */
export function createAdminSupabaseClient() {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}

/**
 * Récupération de l'utilisateur connecté côté serveur
 * Utilise les cookies de session
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Erreur récupération utilisateur serveur:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Client Supabase avec clé service (contourne RLS)
 * ⚠️ À utiliser UNIQUEMENT pour les opérations d'authentification système
 */
function createServiceSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Récupère l'utilisateur connecté avec ses informations internes
 * Combine l'authentification Supabase + données utilisateurs_internes
 * ⚠️ À utiliser uniquement côté serveur
 */
export async function getServerUserInternal(): Promise<AuthenticatedUser | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Erreur authentification serveur:', authError);
    return null;
  }
  
  // Utiliser le client service pour contourner les politiques RLS
  const serviceSupabase = createServiceSupabaseClient();
  
  const { data: utilisateurInterne, error } = await serviceSupabase
    .from('utilisateurs_internes')
    .select('*')
    .eq('auth_user_id', user.id)
    .eq('actif', true)
    .single();
    
  if (error) {
    console.error('Utilisateur non trouvé dans utilisateurs_internes:', error);
    return null;
  }
  
  return {
    authUser: user,
    utilisateurInterne
  };
}

/**
 * Middleware de vérification d'authentification
 * Vérifie que l'utilisateur est connecté et actif
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const userInternal = await getServerUserInternal();
  
  if (!userInternal) {
    throw new Error('Authentication required');
  }
  
  return userInternal;
}

/**
 * Middleware de vérification des rôles
 * Vérifie que l'utilisateur a le rôle requis
 */
export async function requireRole(allowedRoles: string[]): Promise<AuthenticatedUser> {
  const userInternal = await requireAuth();
  
  if (!allowedRoles.includes(userInternal.utilisateurInterne.role)) {
    throw new Error(`Role required: ${allowedRoles.join(' or ')}`);
  }
  
  return userInternal;
}

/**
 * Types exports pour les API routes
 */
export type { Database } from '@/shared/types/database';
