/**
 * Utilitaires Supabase - Helpers et types communs
 */

import { createAdminSupabaseClient } from './server';
import type { UtilisateurInterne } from '@/shared/types/database';

// ========================================
// TYPES UTILITAIRES
// ========================================

export interface AuthenticatedUser {
  authUser: {
    id: string;
    email?: string;
    [key: string]: any;
  };
  utilisateurInterne: UtilisateurInterne;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

export interface ApiSuccessResponse<T = any> {
  data: T;
  success: true;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ========================================
// HELPERS DE VALIDATION
// ========================================

/**
 * Vérifie si une réponse Supabase contient une erreur
 */
export function hasSupabaseError(response: any): boolean {
  return response.error !== null;
}

/**
 * Formate une erreur Supabase pour l'API
 */
export function formatSupabaseError(error: any): ApiErrorResponse {
  return {
    error: {
      message: error.message || 'Erreur base de données',
      code: error.code || 'SUPABASE_ERROR', 
      statusCode: error.statusCode || 500
    }
  };
}

/**
 * Formate une réponse de succès pour l'API
 */
export function formatSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    data,
    success: true
  };
}

// ========================================
// FONCTIONS UTILITAIRES BASE DE DONNÉES
// ========================================

/**
 * Récupère toutes les options actives du catalogue
 * Utilise le client admin pour bypasser RLS (données publiques)
 */
export async function getActiveOptions() {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('options_catalogue')
    .select('*')
    .eq('actif', true)
    .order('type_option, ordre_affichage');
    
  if (error) {
    throw new Error(`Erreur récupération options: ${error.message}`);
  }
  
  return data;
}

/**
 * Récupère le portfolio publié
 * Utilise le client admin pour bypasser RLS (données publiques)
 */
export async function getPublicPortfolio() {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('portfolio_simple')
    .select('*')
    .eq('publie', true)
    .order('ordre_affichage, created_at DESC');
    
  if (error) {
    throw new Error(`Erreur récupération portfolio: ${error.message}`);
  }
  
  return data;
}

/**
 * Génère un numéro de demande unique
 */
export async function generateDemandeNumber(): Promise<string> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase.rpc('generer_numero_demande');
  
  if (error) {
    throw new Error(`Erreur génération numéro: ${error.message}`);
  }
  
  return data;
}

/**
 * Calcule le score d'un lead
 */
export async function calculateLeadScore(leadId: string): Promise<number> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase.rpc('calculer_score_lead', {
    lead_id: leadId
  } as any);
  
  if (error) {
    throw new Error(`Erreur calcul score: ${error.message}`);
  }
  
  return data;
}

// ========================================
// CONSTANTES CONFIGURATION
// ========================================

export const SUPABASE_CONFIG = {
  // Tailles max pour uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Buckets Supabase Storage
  BUCKETS: {
    PORTFOLIO: 'portfolio-images',
    DOCUMENTS: 'documents',
    LOGOS: 'client-logos'
  },
  
  // Politiques RLS
  RLS_POLICIES: {
    ADMIN_ONLY: 'Accès admin uniquement',
    PUBLIC_READ: 'Lecture publique'
  }
} as const;