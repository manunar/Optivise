/**
 * Gestion des sessions de configuration
 * Utilise la table sessions_configuration pour la persistance
 */

import { createAdminSupabaseClient } from '../supabase/server';

export interface SessionData {
  id?: string;
  session_token: string;
  reponses: Record<string, string | string[]>;
  options_recommandees?: string[];
  statut: 'nouveau' | 'en_cours' | 'termine' | 'recommandations_generees' | 'devis_demande';
  created_at?: string;
  updated_at?: string;
}

/**
 * Générer un token de session unique
 */
export function generateSessionToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `session_${timestamp}_${random}`;
}

/**
 * Créer une nouvelle session
 */
export async function createSession(reponses: Record<string, string | string[]> = {}) {
  try {
    const supabase = createAdminSupabaseClient();
    const sessionToken = generateSessionToken();
    
    const { data, error } = await supabase
      .from('sessions_configuration')
      .insert({
        session_token: sessionToken,
        reponses: reponses,
        statut: Object.keys(reponses).length > 0 ? 'en_cours' : 'nouveau',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur création session:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      data: {
        session_token: sessionToken,
        id: data.id,
        statut: data.statut
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sauvegarder les réponses dans une session
 */
export async function saveSessionProgress(
  sessionToken: string, 
  reponses: Record<string, string | string[]>,
  statut: SessionData['statut'] = 'en_cours'
) {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('sessions_configuration')
      .update({
        reponses: reponses,
        statut: statut,
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur sauvegarde session:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer une session par son token
 */
export async function getSession(sessionToken: string) {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('sessions_configuration')
      .select('*')
      .eq('session_token', sessionToken)
      .single();
    
    if (error) {
      console.error('Erreur récupération session:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour les options recommandées d'une session
 */
export async function updateSessionRecommendations(
  sessionToken: string, 
  optionsRecommandees: string[]
) {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('sessions_configuration')
      .update({
        options_recommandees: optionsRecommandees,
        statut: 'recommandations_generees',
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur mise à jour recommandations:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Marquer une session comme terminée (devis demandé)
 */
export async function completeSession(sessionToken: string) {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('sessions_configuration')
      .update({
        statut: 'devis_demande',
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur finalisation session:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une session
 */
export async function deleteSession(sessionToken: string) {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { error } = await supabase
      .from('sessions_configuration')
      .delete()
      .eq('session_token', sessionToken);
    
    if (error) {
      console.error('Erreur suppression session:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Nettoyer les anciennes sessions (plus de 30 jours)
 */
export async function cleanupOldSessions() {
  try {
    const supabase = createAdminSupabaseClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { error } = await supabase
      .from('sessions_configuration')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());
    
    if (error) {
      console.error('Erreur nettoyage sessions:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
