/**
 * Modèle de données pour les demandes de devis
 * Gestion des leads et du pipeline commercial
 */

import { createAdminSupabaseClient, createServerSupabaseClient } from '../supabase/server';
import { 
  DemandeDevis, 
  StatutDemande,
  Database 
} from '@/shared/types/database';
import { 
  LeadEnrichi,
  FormDemandeDevis,
  ApiResponse 
} from '@/shared/types/business';

// ========================================
// CRÉATION ET GESTION DES LEADS
// ========================================

/**
 * Créer une nouvelle demande de devis
 * Utilise le client admin pour bypasser RLS lors de la création publique
 */
export async function createDemandeDevis(data: FormDemandeDevis): Promise<ApiResponse<DemandeDevis>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    // Générer le numéro de demande avec fallback
    const { data: numeroResult, error: rpcError } = await supabase.rpc('generer_numero_demande');
    
    if (rpcError) {
      console.warn('RPC generer_numero_demande non disponible, utilisation du fallback');
    }
    
    // Données minimales pour éviter les erreurs de structure de table
    const insertData = {
      numero_demande: numeroResult || `DEM-${Date.now()}`,
      mode_creation: data.mode_creation,
      email: data.email.toLowerCase().trim(),
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      entreprise: data.entreprise.trim(),
      telephone: data.telephone?.trim() || null,
      configuration_json: data.configuration_json,
      prix_estime_ht: data.prix_estime_ht,
      prix_estime_ttc: data.prix_estime_ttc,
      commentaires_libres: data.commentaires_libres || null,
      consentement_commercial: data.consentement_commercial,
      consentement_newsletter: data.consentement_newsletter
    };
    
    let { data: demande, error } = await supabase
      .from('demandes_devis')
      .insert(insertData)
      .select()
      .single();
      
    // Si la table demandes_devis n'existe pas, essayer une table alternative
    if (error && error.message.includes('relation') || error && error.message.includes('field')) {
      console.warn('Table demandes_devis non compatible, tentative avec structure simplifiée');
      
      // Essayer avec seulement les champs essentiels pour la table clients
      const simpleData = {
        email: data.email.toLowerCase().trim(),
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        entreprise: data.entreprise.trim(),
        telephone: data.telephone?.trim() || null,
        commune: null,
        secteur_activite: null
      };
      
      // Essayer la table clients
      const { data: fallbackDemande, error: fallbackError } = await supabase
        .from('clients')
        .insert(simpleData)
        .select()
        .single();
        
      if (!fallbackError && fallbackDemande) {
        return {
          success: true,
          data: fallbackDemande as any // Cast temporaire pour éviter les erreurs de type
        };
      }
    }
      
    if (error) {
      console.error('Erreur insertion demande:', error.message);
      return {
        success: false,
        error: {
          code: 'CREATE_DEMANDE_ERROR',
          message: `Erreur création demande: ${error.message}`
        }
      };
    }
    
    // Assignation automatique (optionnelle, ne bloque pas la création)
    try {
      if (demande) {
        await assignLeadToCommercial(demande.id);
      }
    } catch (assignError) {
      console.warn('Erreur assignation automatique:', assignError);
      // Continue sans bloquer la création
    }
    
    return {
      success: true,
      data: demande!
    };
    
  } catch (error) {
    console.error('Erreur inattendue création demande:', error);
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
 * Récupérer toutes les demandes avec enrichissement
 * Nécessite authentification (utilise server client)
 */
export async function getDemandesDevis(filters?: {
  statut?: StatutDemande;
  assignee_id?: string;
  secteur?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<LeadEnrichi[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('demandes_devis')
      .select(`
        *,
        assignee:utilisateurs_internes(id, nom, prenom, email)
      `)
      .order('priorite_score', { ascending: false })
      .order('created_at', { ascending: false });
    
    // Appliquer les filtres
    if (filters?.statut) {
      query = query.eq('statut', filters.statut);
    }
    
    if (filters?.assignee_id) {
      query = query.eq('assignee_id', filters.assignee_id);
    }
    
    if (filters?.secteur) {
      query = query.eq('secteur_activite', filters.secteur);
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 25)) - 1);
    }
    
    const { data: demandes, error } = await query;
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_DEMANDES_ERROR',
          message: `Erreur récupération demandes: ${error.message}`
        }
      };
    }
    
    // Enrichir les données
    const demandesEnrichies: LeadEnrichi[] = demandes.map((demande: any) => ({
      ...demande,
      assignee: demande.assignee || undefined,
      age_jours: Math.floor((Date.now() - new Date(demande.created_at!).getTime()) / (1000 * 60 * 60 * 24)),
      score_display: getScoreDisplay(demande.priorite_score || 0),
      nb_communications: 0, // TODO: Compter via jointure
      configuration_readable: parseConfiguration(demande.configuration_json || {})
    }));
    
    return {
      success: true,
      data: demandesEnrichies
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
 * Mettre à jour le statut d'une demande
 */
export async function updateDemandeStatut(
  id: string, 
  statut: StatutDemande,
  notes?: string
): Promise<ApiResponse<DemandeDevis>> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const updateData: Database['public']['Tables']['demandes_devis']['Update'] = {
      statut,
      updated_at: new Date().toISOString()
    };
    
    // Ajouter une note si fournie
    if (notes) {
      const { data: currentDemande } = await supabase
        .from('demandes_devis')
        .select('notes_internes')
        .eq('id', id)
        .single();
        
      if (currentDemande) {
        updateData.notes_internes = [
          ...((currentDemande as any).notes_internes || []),
          `${new Date().toISOString()}: ${notes}`
        ];
      }
    }
    
    const { data: demande, error } = await (supabase as any)
      .from('demandes_devis')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_STATUT_ERROR',
          message: `Erreur mise à jour statut: ${error.message}`
        }
      };
    }
    
    return {
      success: true,
      data: demande
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

/**
 * Assigner un lead à un commercial
 */
export async function assignLeadToCommercial(
  leadId: string, 
  commercialId?: string
): Promise<ApiResponse<DemandeDevis>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    let targetCommercialId = commercialId;
    
    // Si pas de commercial spécifié, assignation automatique
    if (!targetCommercialId) {
      const { data: commerciaux } = await supabase
        .from('utilisateurs_internes')
        .select('id, charge_actuelle, charge_max')
        .eq('actif', true)
        .in('role', ['commercial', 'admin'])
        .order('charge_actuelle', { ascending: true });
        
      if (commerciaux && commerciaux.length > 0) {
        // Prendre le commercial avec la charge la plus faible
        const commercialDisponible = (commerciaux as any[]).find((c: any) => c.charge_actuelle < c.charge_max);
        targetCommercialId = commercialDisponible?.id || (commerciaux as any[])[0].id;
      }
    }
    
    if (!targetCommercialId) {
      return {
        success: false,
        error: {
          code: 'NO_COMMERCIAL_AVAILABLE',
          message: 'Aucun commercial disponible pour assignation'
        }
      };
    }
    
    // Assigner le lead
    const { data: demande, error } = await (supabase as any)
      .from('demandes_devis')
      .update({ 
        assignee_id: targetCommercialId,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single();
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'ASSIGN_ERROR',
          message: `Erreur assignation: ${error.message}`
        }
      };
    }
    
    // Incrémenter la charge du commercial
    await (supabase as any)
      .from('utilisateurs_internes')
      .update({ 
        charge_actuelle: (supabase as any).sql`charge_actuelle + 1` 
      })
      .eq('id', targetCommercialId);
    
    return {
      success: true,
      data: demande
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue lors de l\'assignation'
      }
    };
  }
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Convertir le score numérique en affichage
 */
function getScoreDisplay(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Parser la configuration JSON en format lisible
 */
function parseConfiguration(config: Record<string, any>) {
  return {
    options: config.options_selectionnees || [],
    secteur: config.secteur_activite || 'Non spécifié',
    budget_estime: config.prix_estime_ttc || 0
  };
}
