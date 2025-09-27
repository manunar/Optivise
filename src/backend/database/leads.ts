/**
 * Modèle de données pour les leads (version simplifiée)
 * Gestion basique des demandes de devis
 */

import { createAdminSupabaseClient } from '../supabase/server';
import { FormDemandeDevis, ApiResponse } from '@/shared/types/business';

// ========================================
// CRÉATION DE LEADS SIMPLIFIÉE
// ========================================

/**
 * Créer une nouvelle demande de devis (version simplifiée)
 */
export async function createSimpleDemandeDevis(data: FormDemandeDevis): Promise<ApiResponse<any>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    // Préparer les données pour l'insertion
    const insertData = {
      mode_creation: data.mode_creation,
      configuration_json: data.configuration_json,
      prix_estime_ht: data.prix_estime_ht,
      prix_estime_ttc: data.prix_estime_ttc,
      email: data.email.toLowerCase().trim(),
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      telephone: data.telephone?.trim() || null,
      entreprise: data.entreprise.trim(),
      commune: data.commune?.trim() || null,
      secteur_activite: data.secteur_activite || null,
      objectif_principal: data.objectif_principal || null,
      situation_actuelle: data.situation_actuelle || null,
      ambition_impact: null,
      autonomie_souhaitee: null,
      budget_max: data.budget_max || null,
      delai_souhaite: data.delai_souhaite || null,
      contenus_disponibles: data.contenus_disponibles || null,
      commentaires_libres: data.commentaires_libres || null,
      consentement_commercial: data.consentement_commercial,
      consentement_newsletter: data.consentement_newsletter,
      statut: 'nouveau' as const,
      assignee_id: null,
      notes_internes: [],
      prochaine_action: null,
      date_prochaine_action: null
    };
    
    const { data: demande, error } = await (supabase as any)
      .from('demandes_devis')
      .insert(insertData)
      .select()
      .single();
      
    if (error) {
      console.error('Erreur création demande:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_DEMANDE_ERROR',
          message: `Erreur lors de la création: ${error.message}`
        }
      };
    }
    
    return {
      success: true,
      data: demande
    };
    
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue lors de la création'
      }
    };
  }
}

/**
 * Récupérer toutes les demandes (version simplifiée)
 */
export async function getSimpleDemandesDevis(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('demandes_devis')
      .select(`
        *,
        assignee:utilisateurs_internes(nom, prenom, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_DEMANDES_ERROR',
          message: `Erreur récupération: ${error.message}`
        }
      };
    }
    
    return {
      success: true,
      data: data || []
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue lors de la récupération'
      }
    };
  }
}

/**
 * Récupérer une demande par ID
 */
export async function getDemandeById(id: string): Promise<ApiResponse<any>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('demandes_devis')
      .select(`
        *,
        assignee:utilisateurs_internes(nom, prenom, email)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_DEMANDE_ERROR',
          message: `Demande non trouvée: ${error.message}`
        }
      };
    }
    
    return {
      success: true,
      data
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue'
      }
    };
  }
}

/**
 * Mettre à jour le statut d'une demande
 */
export async function updateDemandeStatut(id: string, statut: string): Promise<ApiResponse<any>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await (supabase as any)
      .from('demandes_devis')
      .update({ 
        statut,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: `Erreur mise à jour: ${error.message}`
        }
      };
    }
    
    return {
      success: true,
      data
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue lors de la mise à jour'
      }
    };
  }
}
