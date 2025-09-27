/**
 * Schémas de validation Zod pour les demandes de devis
 * Validation des formulaires de contact et leads
 */

import { z } from 'zod';
import { SecteurActiviteSchema, ObjectifPrincipalSchema, DelaiSouhaiteSchema } from './configurateur';

// ========================================
// VALIDATION EMAIL ET CONTACT
// ========================================

export const EmailSchema = z.string()
  .email('Format email invalide')
  .min(5, 'Email trop court')
  .max(100, 'Email trop long')
  .transform(val => val.toLowerCase().trim());

export const TelephoneSchema = z.string()
  .regex(/^[\+]?[0-9\s\-\(\)\.]{8,20}$/, 'Numéro de téléphone invalide')
  .optional()
  .or(z.literal(''));

export const NomPrenomSchema = z.string()
  .min(1, 'Nom requis')
  .max(50, 'Maximum 50 caractères')
  .transform(val => val.trim());

export const EntrepriseSchema = z.string()
  .min(2, 'Nom d\'entreprise requis (minimum 2 caractères)')
  .max(100, 'Nom d\'entreprise trop long')
  .transform(val => val.trim());

// ========================================
// FORMULAIRE DEMANDE DE DEVIS COMPLET
// ========================================

export const FormDemandeDevisSchema = z.object({
  // Configuration (cachée - pré-remplie par le configurateur)
  configuration_json: z.record(z.string(), z.any()),
  prix_estime_ht: z.number().min(0),
  prix_estime_ttc: z.number().min(0),
  mode_creation: z.enum(['assiste', 'libre']),
  
  // Contact (obligatoire)
  email: EmailSchema,
  nom: NomPrenomSchema,
  prenom: NomPrenomSchema,
  telephone: TelephoneSchema,
  entreprise: EntrepriseSchema,
  commune: z.string()
    .min(2, 'Commune requise')
    .max(100, 'Commune trop longue')
    .optional()
    .or(z.literal('')),
  
  // Contexte business (assisté) - Permissif pour compatibilité
  secteur_activite: z.string().optional(),
  objectif_principal: z.string().optional(),
  situation_actuelle: z.string()
    .max(500, 'Description trop longue (max 500 caractères)')
    .optional(),
  budget_max: z.number()
    .min(0)
    .max(100000, 'Budget trop élevé')
    .optional(),
  delai_souhaite: z.string().optional(),
  
  // Informations complémentaires (optionnel)
  contenus_disponibles: z.string()
    .max(300, 'Description trop longue')
    .optional()
    .or(z.literal('')),
  commentaires_libres: z.string()
    .max(1000, 'Commentaires trop longs (max 1000 caractères)')
    .optional()
    .or(z.literal('')),
  
  // RGPD (obligatoire)
  consentement_commercial: z.boolean()
    .refine(val => val === true, 'Consentement requis pour être recontacté'),
  consentement_newsletter: z.boolean().default(false)
});

// ========================================
// FORMULAIRE CONTACT SIMPLE
// ========================================

export const FormContactSchema = z.object({
  nom: NomPrenomSchema,
  prenom: NomPrenomSchema,
  email: EmailSchema,
  telephone: TelephoneSchema,
  entreprise: EntrepriseSchema.optional().or(z.literal('')),
  sujet: z.string()
    .min(5, 'Sujet requis (minimum 5 caractères)')
    .max(100, 'Sujet trop long'),
  message: z.string()
    .min(10, 'Message requis (minimum 10 caractères)')
    .max(2000, 'Message trop long (max 2000 caractères)'),
  consentement_commercial: z.boolean()
    .refine(val => val === true, 'Consentement requis pour être recontacté')
});

// ========================================
// VALIDATION ADMIN (BACKEND)
// ========================================

export const UpdateStatutDemandeSchema = z.object({
  statut: z.enum(['nouveau', 'contacte', 'qualifie', 'rdv_planifie', 'devis_final_envoye', 'signe', 'perdu']),
  notes: z.string()
    .max(500, 'Notes trop longues')
    .optional(),
  assignee_id: z.string().uuid().optional(),
  prochaine_action: z.string()
    .max(200, 'Action trop longue')
    .optional(),
  date_prochaine_action: z.string().datetime().optional()
});

export const AssignationLeadSchema = z.object({
  lead_id: z.string().uuid('ID lead invalide'),
  commercial_id: z.string().uuid('ID commercial invalide').optional(),
  force: z.boolean().default(false) // Forcer même si charge max atteinte
});

// ========================================
// VALIDATION DONNÉES ENRICHIES
// ========================================

export const FiltresDemandesSchema = z.object({
  statut: z.enum(['nouveau', 'contacte', 'qualifie', 'rdv_planifie', 'devis_final_envoye', 'signe', 'perdu']).optional(),
  assignee_id: z.string().uuid().optional(),
  secteur: SecteurActiviteSchema.optional(),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional(),
  score_min: z.number().min(0).max(100).optional(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
  tri: z.enum(['recent', 'score', 'nom', 'entreprise']).default('recent')
});

// ========================================
// HELPERS DE VALIDATION
// ========================================

/**
 * Nettoyer et valider les données de demande de devis
 */
export function validateDemandeDevis(data: unknown): {
  success: boolean;
  data?: z.infer<typeof FormDemandeDevisSchema>;
  errors?: string[];
} {
  try {
    const result = FormDemandeDevisSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e: any) => {
          const field = e.path.join('.');
          return `${field}: ${e.message}`;
        })
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}

/**
 * Valider un formulaire de contact simple
 */
export function validateContact(data: unknown): {
  success: boolean;
  data?: z.infer<typeof FormContactSchema>;
  errors?: string[];
} {
  try {
    const result = FormContactSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e: any) => {
          const field = e.path.join('.');
          return `${field}: ${e.message}`;
        })
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}

/**
 * Valider les filtres de recherche
 */
export function validateFiltres(data: unknown): {
  success: boolean;
  data?: z.infer<typeof FiltresDemandesSchema>;
  errors?: string[];
} {
  try {
    const result = FiltresDemandesSchema.parse(data);
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

// ========================================
// VALIDATION BUSINESS RULES
// ========================================

/**
 * Valider la cohérence budget/configuration
 */
export function validateBudgetCoherence(
  budget: number | null, 
  prixEstime: number
): { valid: boolean; message?: string } {
  if (!budget) {
    return { valid: true }; // Pas de budget = pas de contrainte
  }
  
  if (budget < prixEstime * 0.8) {
    return {
      valid: false,
      message: 'Le budget indiqué semble insuffisant pour la configuration choisie'
    };
  }
  
  if (budget > prixEstime * 3) {
    return {
      valid: false,
      message: 'Le budget semble surévalué par rapport à la configuration'
    };
  }
  
  return { valid: true };
}

/**
 * Valider la qualité d'un lead
 */
export function validateLeadQuality(lead: any): {
  score: number;
  warnings: string[];
} {
  let score = 50; // Base
  const warnings: string[] = [];
  
  // Email et téléphone
  if (lead.email && lead.telephone) {
    score += 15;
  } else if (!lead.telephone) {
    warnings.push('Numéro de téléphone manquant');
  }
  
  // Informations business complètes
  if (lead.secteur_activite && lead.objectif_principal) {
    score += 10;
  } else {
    warnings.push('Informations secteur/objectif incomplètes');
  }
  
  // Budget renseigné
  if (lead.budget_max && lead.budget_max > 0) {
    score += 10;
  } else {
    warnings.push('Budget non renseigné');
  }
  
  // Commentaires détaillés
  if (lead.commentaires_libres && lead.commentaires_libres.length > 50) {
    score += 10;
  }
  
  // Délai réaliste
  if (lead.delai_souhaite && !lead.delai_souhaite.includes('Urgent')) {
    score += 5;
  }
  
  return { score: Math.min(score, 100), warnings };
}

// ========================================
// TYPES EXPORTÉS
// ========================================

export type FormDemandeDevis = z.infer<typeof FormDemandeDevisSchema>;
export type FormContact = z.infer<typeof FormContactSchema>;
export type UpdateStatutDemande = z.infer<typeof UpdateStatutDemandeSchema>;
export type FiltresDemandes = z.infer<typeof FiltresDemandesSchema>;
export type AssignationLead = z.infer<typeof AssignationLeadSchema>;
