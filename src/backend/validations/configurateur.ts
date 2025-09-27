/**
 * Schémas de validation Zod pour le configurateur
 * Validation des données du configurateur et calculs
 */

import { z } from 'zod';

// ========================================
// SCHÉMAS DE BASE
// ========================================

export const SecteurActiviteSchema = z.enum([
  'restaurant',
  'coiffeur', 
  'artisan',
  'therapeute',
  'coach',
  'service',
  'commerce',
  'autre'
]);

export const ObjectifPrincipalSchema = z.enum([
  'Visibilité locale',
  'Génération de leads',
  'Vente en ligne',
  'Crédibilité professionnelle',
  'Informer mes clients',
  'Réservations en ligne'
]);

export const DelaiSouhaiteSchema = z.enum([
  'Urgent (2 semaines)',
  'Dans le mois',
  '2-3 mois',
  'Pas pressé'
]);

export const ModeCreationSchema = z.enum(['assiste', 'libre']);

// ========================================
// CONFIGURATION PRODUIT
// ========================================

export const ConfigurationOptionSchema = z.object({
  id: z.string().uuid(),
  selected: z.boolean(),
  quantite: z.number().int().min(1).default(1)
});

export const ConfigurationCompleteSchema = z.object({
  secteur_activite: SecteurActiviteSchema,
  mode_creation: ModeCreationSchema,
  options_selectionnees: z.array(z.string().uuid()).min(1, 'Au moins une option doit être sélectionnée'),
  prix_total_ht: z.number().min(0),
  prix_total_ttc: z.number().min(0),
  delai_estime_jours: z.number().int().min(1),
  
  // Optionnel pour mode assisté
  objectif_principal: ObjectifPrincipalSchema.optional(),
  situation_actuelle: z.string().max(500).optional(),
  budget_max: z.number().min(0).max(50000).optional(),
  delai_souhaite: DelaiSouhaiteSchema.optional()
});

// ========================================
// ÉTAPES DU CONFIGURATEUR
// ========================================

export const EtapeContexteSchema = z.object({
  secteur_activite: SecteurActiviteSchema,
  objectif_principal: ObjectifPrincipalSchema,
  situation_actuelle: z.string()
    .min(10, 'Décrivez votre situation en quelques mots')
    .max(500, 'Description trop longue')
    .optional(),
  clientele_type: z.string()
    .max(300, 'Description trop longue')
    .optional()
});

export const EtapeOptionsSchema = z.object({
  options_selectionnees: z.array(z.string().uuid())
    .min(1, 'Sélectionnez au moins le pack de base'),
  pack_base_obligatoire: z.boolean()
    .refine(val => val === true, 'Le pack de base est obligatoire')
});

export const EtapeBudgetSchema = z.object({
  budget_max: z.number()
    .min(500, 'Budget minimum 500€')
    .max(50000, 'Budget maximum 50000€')
    .optional(),
  delai_souhaite: DelaiSouhaiteSchema,
  autonomie_souhaitee: z.enum([
    'Formation incluse',
    'Gestion déléguée',
    'Support technique'
  ]).optional()
});

// ========================================
// VALIDATION CROISÉE
// ========================================

export const ValidationConfigurationSchema = z.object({
  configuration: ConfigurationCompleteSchema,
  // Règles business
  budget_coherent: z.boolean()
    .refine(val => val === true, 'Le budget doit être cohérent avec les options'),
  options_compatibles: z.boolean()
    .refine(val => val === true, 'Certaines options sont incompatibles'),
  prerequis_respectes: z.boolean()
    .refine(val => val === true, 'Des prérequis sont manquants')
});

// ========================================
// CALCULS ET ESTIMATIONS
// ========================================

export const CalculPrixSchema = z.object({
  options_ids: z.array(z.string().uuid()),
  // Résultats calculés
  prix_ht: z.number().min(0),
  prix_ttc: z.number().min(0),
  delai_jours: z.number().int().min(1),
  marge_totale: z.number().min(0),
  // Détail par option
  details: z.array(z.object({
    option_id: z.string().uuid(),
    nom: z.string(),
    prix_ht: z.number(),
    delai_jours: z.number()
  }))
});

// ========================================
// TYPES EXPORTÉS
// ========================================

export type SecteurActivite = z.infer<typeof SecteurActiviteSchema>;
export type ObjectifPrincipal = z.infer<typeof ObjectifPrincipalSchema>;
export type DelaiSouhaite = z.infer<typeof DelaiSouhaiteSchema>;
export type ModeCreation = z.infer<typeof ModeCreationSchema>;
export type ConfigurationComplete = z.infer<typeof ConfigurationCompleteSchema>;
export type EtapeContexte = z.infer<typeof EtapeContexteSchema>;
export type EtapeOptions = z.infer<typeof EtapeOptionsSchema>;
export type EtapeBudget = z.infer<typeof EtapeBudgetSchema>;
export type CalculPrix = z.infer<typeof CalculPrixSchema>;

// ========================================
// HELPERS DE VALIDATION
// ========================================

/**
 * Valider une configuration complète
 */
export function validateConfiguration(data: unknown): { 
  success: boolean; 
  data?: ConfigurationComplete; 
  errors?: string[] 
} {
  try {
    const result = ConfigurationCompleteSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`) 
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}

/**
 * Valider une étape spécifique
 */
export function validateEtape(
  etape: 'contexte' | 'options' | 'budget', 
  data: unknown
): { success: boolean; data?: any; errors?: string[] } {
  try {
    let schema;
    switch (etape) {
      case 'contexte':
        schema = EtapeContexteSchema;
        break;
      case 'options':
        schema = EtapeOptionsSchema;
        break;
      case 'budget':
        schema = EtapeBudgetSchema;
        break;
      default:
        return { success: false, errors: ['Étape inconnue'] };
    }
    
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`) 
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}
