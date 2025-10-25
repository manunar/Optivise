/**
 * Modèle de données simplifié pour les options du catalogue
 * Gestion du catalogue produits et configurateur
 */

import { createAdminSupabaseClient } from '../supabase/server';
import { OptionsCatalogue, TypeOption } from '@/shared/types/database';
import { ConfigurationOption, ApiResponse } from '@/shared/types/business';

// ========================================
// RÉCUPÉRATION DES OPTIONS
// ========================================

/**
 * Récupérer toutes les options actives du catalogue
 * Public - utilise admin client pour bypass RLS
 */
export async function getActiveOptions(): Promise<ApiResponse<OptionsCatalogue[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('options_catalogue')
      .select('*')
      .eq('actif', true)
      .order('type_option, ordre_affichage');
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_OPTIONS_ERROR',
          message: `Erreur récupération options: ${error.message}`
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
        message: 'Erreur inattendue lors de la récupération des options'
      }
    };
  }
}

/**
 * Récupérer les options filtrées par type
 */
export async function getOptionsByType(type: TypeOption): Promise<ApiResponse<OptionsCatalogue[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('options_catalogue')
      .select('*')
      .eq('actif', true)
      .eq('type_option', type)
      .order('ordre_affichage');
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_OPTIONS_BY_TYPE_ERROR',
          message: `Erreur récupération options par type: ${error.message}`
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
        message: 'Erreur inattendue lors de la récupération par type'
      }
    };
  }
}

/**
 * Récupérer les options recommandées pour un secteur
 */
export async function getOptionsForSecteur(secteur: string): Promise<ApiResponse<OptionsCatalogue[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('options_catalogue')
      .select('*')
      .eq('actif', true)
      .contains('recommande_pour_secteurs', [secteur])
      .order('type_option, ordre_affichage');
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_OPTIONS_SECTEUR_ERROR',
          message: `Erreur récupération options pour secteur: ${error.message}`
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
        message: 'Erreur inattendue lors de la récupération par secteur'
      }
    };
  }
}

// ========================================
// LOGIQUE CONFIGURATEUR
// ========================================

/**
 * Calculer le prix total d'une configuration
 */
export function calculateConfigurationPrice(
  options: OptionsCatalogue[], 
  selectedOptionsIds: string[]
): { prixMinHT: number; prixMaxHT: number; prixMinTTC: number; prixMaxTTC: number; delaiJours: number } {
  const selectedOptions = options.filter(opt => selectedOptionsIds.includes(opt.id));
  
  const prixMinHT = selectedOptions.reduce((total, option) => {
    const prix = option.prix_min_ht ?? option.prix_ht ?? 0;
    return total + prix;
  }, 0);
  
  const prixMaxHT = selectedOptions.reduce((total, option) => {
    const prix = option.prix_max_ht ?? option.prix_ht ?? 0;
    return total + prix;
  }, 0);
  
  const prixMinTTC = prixMinHT * 1.21; // TVA 21% Belgique
  const prixMaxTTC = prixMaxHT * 1.21;
  
  const delaiJours = Math.max(
    ...selectedOptions.map(opt => opt.temps_realisation_jours || 1),
    7 // Minimum 7 jours
  );
  
  return {
    prixMinHT: Math.round(prixMinHT * 100) / 100,
    prixMaxHT: Math.round(prixMaxHT * 100) / 100,
    prixMinTTC: Math.round(prixMinTTC * 100) / 100,
    prixMaxTTC: Math.round(prixMaxTTC * 100) / 100,
    delaiJours
  };
}

/**
 * Vérifier les incompatibilités dans une sélection
 */
export function checkIncompatibilities(
  options: OptionsCatalogue[],
  selectedOptionsIds: string[]
): { hasIncompatibilities: boolean; conflicts: string[] } {
  const selectedOptions = options.filter(opt => selectedOptionsIds.includes(opt.id));
  const conflicts: string[] = [];
  
  for (const option of selectedOptions) {
    // Vérifier si cette option est incompatible avec d'autres sélectionnées
    const incompatibleIds = option.incompatible_avec || [];
    const conflictingSelected = selectedOptionsIds.filter(id => 
      id !== option.id && incompatibleIds.includes(options.find(o => o.id === id)?.code || '')
    );
    
    if (conflictingSelected.length > 0) {
      conflicts.push(`${option.nom} est incompatible avec d'autres options sélectionnées`);
    }
  }
  
  return {
    hasIncompatibilities: conflicts.length > 0,
    conflicts
  };
}

/**
 * Obtenir les prérequis manquants
 */
export function checkPrerequisites(
  options: OptionsCatalogue[],
  selectedOptionsIds: string[]
): { missingPrerequisites: boolean; missing: string[] } {
  const selectedOptions = options.filter(opt => selectedOptionsIds.includes(opt.id));
  const selectedCodes = selectedOptions.map(opt => opt.code);
  const missing: string[] = [];
  
  for (const option of selectedOptions) {
    const prerequis = option.prerequis || [];
    
    for (const prerequisCode of prerequis) {
      if (!selectedCodes.includes(prerequisCode)) {
        const prerequisOption = options.find(opt => opt.code === prerequisCode);
        if (prerequisOption) {
          missing.push(`${option.nom} nécessite ${prerequisOption.nom}`);
        }
      }
    }
  }
  
  return {
    missingPrerequisites: missing.length > 0,
    missing
  };
}

/**
 * Enrichir les options pour l'affichage configurateur
 */
export function enrichOptionsForConfigurator(
  options: OptionsCatalogue[],
  selectedOptionsIds: string[],
  secteur?: string
): ConfigurationOption[] {
  return options.map(option => ({
    id: option.id,
    code: option.code,
    nom: option.nom,
    description_courte: option.description_courte || '',
    prix_ht: option.prix_ht ?? 0,
    prix_min_ht: option.prix_min_ht ?? undefined,
    prix_max_ht: option.prix_max_ht ?? undefined,
    type_option: option.type_option,
    categorie: option.categorie,
    obligatoire: option.obligatoire || false,
    recommande: secteur ? (option.recommande_pour_secteurs || []).includes(secteur) : false,
    incompatible: checkIncompatibilities(options, [...selectedOptionsIds, option.id]).hasIncompatibilities,
    selected: selectedOptionsIds.includes(option.id)
  }));
}
