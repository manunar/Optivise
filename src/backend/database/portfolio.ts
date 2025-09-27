/**
 * Modèle de données pour le portfolio
 * Gestion simple du showcase de réalisations
 */

import { createAdminSupabaseClient } from '../supabase/server';
import { ApiResponse } from '@/shared/types/business';

// ========================================
// GESTION DU PORTFOLIO
// ========================================

/**
 * Récupérer le portfolio public
 */
export async function getPublicPortfolio(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('portfolio_simple')
      .select('*')
      .eq('publie', true)
      .order('ordre_affichage, created_at DESC');
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_PORTFOLIO_ERROR',
          message: `Erreur récupération portfolio: ${error.message}`
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
        message: 'Erreur inattendue lors de la récupération du portfolio'
      }
    };
  }
}

/**
 * Récupérer le portfolio filtré par secteur
 */
export async function getPortfolioBySecteur(secteur: string): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('portfolio_simple')
      .select('*')
      .eq('publie', true)
      .eq('secteur', secteur)
      .order('ordre_affichage, created_at DESC');
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_PORTFOLIO_SECTEUR_ERROR',
          message: `Erreur récupération portfolio par secteur: ${error.message}`
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

/**
 * Ajouter un projet au portfolio (admin)
 */
export async function addPortfolioItem(item: {
  titre: string;
  secteur: string;
  url_site: string;
  description_courte: string;
  technologies_utilisees?: string[];
  image_principale?: string;
  ordre_affichage?: number;
}): Promise<ApiResponse<any>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const insertData = {
      titre: item.titre.trim(),
      secteur: item.secteur,
      url_site: item.url_site.trim(),
      description_courte: item.description_courte.trim(),
      technologies_utilisees: item.technologies_utilisees || [],
      image_principale: item.image_principale || null,
      ordre_affichage: item.ordre_affichage || 0,
      publie: true
    };
    
    const { data, error } = await (supabase as any)
      .from('portfolio_simple')
      .insert(insertData)
      .select()
      .single();
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_PORTFOLIO_ERROR',
          message: `Erreur création portfolio: ${error.message}`
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
        message: 'Erreur inattendue lors de la création'
      }
    };
  }
}

/**
 * Récupérer tous les secteurs disponibles dans le portfolio
 */
export async function getPortfolioSecteurs(): Promise<ApiResponse<string[]>> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from('portfolio_simple')
      .select('secteur')
      .eq('publie', true);
      
    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_SECTEURS_ERROR',
          message: `Erreur récupération secteurs: ${error.message}`
        }
      };
    }
    
    // Extraire les secteurs uniques
    const secteurs = Array.from(new Set((data as any[])?.map((item: any) => item.secteur) || []));
    
    return {
      success: true,
      data: secteurs
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erreur inattendue lors de la récupération des secteurs'
      }
    };
  }
}