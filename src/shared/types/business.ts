/**
 * Types métier pour l'application WebCraft
 * Types dérivés des données Supabase mais adaptés à la logique business
 */

import { 
  DemandeDevis, 
  OptionsCatalogue, 
  DevisFinal, 
  Client, 
  Commande, 
  Projet,
  PortfolioSimple,
  StatutDemande,
  TypeOption 
} from './database';

// ========================================
// CONFIGURATEUR - TYPES BUSINESS
// ========================================

export interface ConfigurationOption {
  id: string;
  code: string;
  nom: string;
  description_courte: string;
  prix_ht: number;
  prix_min_ht?: number;
  prix_max_ht?: number;
  type_option: TypeOption;
  categorie: string | null;
  obligatoire: boolean;
  recommande: boolean; // Calculé selon le secteur
  incompatible: boolean; // Calculé selon les autres sélections
  selected: boolean; // État UI
}

export interface ConfigurationComplete {
  secteur_activite: string;
  mode_creation: 'assiste' | 'libre';
  options_selectionnees: string[]; // IDs des options
  prix_total_ht: number;
  prix_total_ttc: number;
  delai_estime_jours: number;
  
  // Données contextuelles (mode assisté)
  objectif_principal?: string;
  situation_actuelle?: string;
  budget_max?: number;
  delai_souhaite?: string;
}

export interface EtapeConfigurateur {
  numero: number;
  titre: string;
  description: string;
  completed: boolean;
  active: boolean;
}

// ========================================
// LEADS & COMMERCIAL - TYPES BUSINESS
// ========================================

export interface LeadEnrichi extends DemandeDevis {
  // Relations
  assignee?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  
  // Données calculées
  age_jours: number;
  score_display: 'low' | 'medium' | 'high' | 'critical';
  prochaine_action_formatted?: string;
  
  // Métriques
  nb_communications: number;
  derniere_communication_date?: string;
  
  // Configuration décodée
  configuration_readable: {
    options: string[];
    secteur: string;
    budget_estime: number;
  };
}

export interface PipelineStatut {
  statut: StatutDemande;
  libelle: string;
  couleur: string;
  icone: string;
  nb_leads: number;
  valeur_totale: number;
  age_moyen_jours: number;
}

export interface PerformanceCommercial {
  utilisateur_id: string;
  nom_complet: string;
  charge_actuelle: number;
  charge_max: number;
  charge_pourcentage: number;
  nb_leads_assignes: number;
  nb_leads_signes: number;
  taux_conversion: number;
  ca_genere: number;
  objectif_mensuel?: number;
}

// ========================================
// DEVIS & FACTURATION - TYPES BUSINESS
// ========================================

export interface DevisAvecDetails extends DevisFinal {
  // Relations
  demande_origine: Pick<DemandeDevis, 'email' | 'nom' | 'prenom' | 'entreprise' | 'secteur_activite'>;
  
  // Configuration décodée
  options_detaillees: {
    nom: string;
    prix_ht: number;
    quantite: number;
  }[];
  
  // État business
  jours_depuis_envoi?: number;
  prochaine_relance_due?: boolean;
  expire_bientot?: boolean;
}

export interface FactureInfo {
  type: 'acompte' | 'solde';
  numero: string;
  montant_ht: number;
  montant_ttc: number;
  date_envoi?: string;
  date_paiement?: string;
  statut: 'a_envoyer' | 'envoyee' | 'payee' | 'en_retard';
}

// ========================================
// PROJETS - TYPES BUSINESS
// ========================================

export interface ProjetAvecDetails extends Projet {
  // Relations
  client: Pick<Client, 'nom' | 'prenom' | 'entreprise' | 'email' | 'telephone'>;
  commande: Pick<Commande, 'numero_commande' | 'prix_ttc'>;
  chef_projet?: Pick<import('./database').UtilisateurInterne, 'nom' | 'prenom' | 'email'>;
  
  // Métriques
  progression_pourcentage: number;
  jours_ecoules: number;
  jours_restants?: number;
  en_retard: boolean;
  
  // Status enrichi
  statut_display: {
    libelle: string;
    couleur: string;
    prochaine_etape: string;
  };
}

export interface JalonProjet {
  id: string;
  titre: string;
  description: string;
  date_prevue: string;
  date_realisee?: string;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'en_retard';
  bloquant: boolean;
}

// ========================================
// PORTFOLIO - TYPES BUSINESS
// ========================================

export interface PortfolioAvecFilters extends PortfolioSimple {
  // Pour l'affichage
  secteur_display: string;
  technologies_formatted: string;
  
  // Pour le configurateur
  options_equivalentes: string[]; // Codes des options utilisées
  preset_config?: Partial<ConfigurationComplete>;
}

export interface FiltersPortfolio {
  secteurs: string[];
  secteur_selectionne?: string;
  technologies: string[];
  tri: 'recent' | 'populaire' | 'secteur';
}

// ========================================
// DASHBOARD & ANALYTICS - TYPES BUSINESS
// ========================================

export interface MetriquesGlobales {
  // Période courante
  periode: {
    debut: string;
    fin: string;
    libelle: string;
  };
  
  // KPIs principaux
  nb_leads_total: number;
  nb_leads_signes: number;
  taux_conversion: number;
  ca_realise: number;
  ca_potentiel: number;
  
  // Comparaison période précédente
  evolution: {
    leads: number; // %
    conversion: number; // %
    ca: number; // %
  };
  
  // Répartition
  repartition_secteurs: Array<{
    secteur: string;
    nb_leads: number;
    ca: number;
  }>;
  
  // Pipeline
  pipeline: PipelineStatut[];
}

export interface AlerteBusiness {
  id: string;
  type: 'urgent' | 'important' | 'info';
  titre: string;
  message: string;
  url?: string;
  date_creation: string;
  vue: boolean;
}

// ========================================
// FORMS & VALIDATION - TYPES BUSINESS
// ========================================

export interface FormDemandeDevis {
  // Configuration (hidden)
  configuration_json: Record<string, any>;
  prix_estime_ht: number;
  prix_estime_ttc: number;
  mode_creation: 'assiste' | 'libre';
  
  // Contact (required)
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  entreprise: string;
  commune?: string;
  
  // Business context
  secteur_activite?: string;
  objectif_principal?: string;
  situation_actuelle?: string;
  budget_max?: number;
  delai_souhaite?: string;
  
  // Additional info (optional)
  contenus_disponibles?: string;
  commentaires_libres?: string;
  
  // RGPD
  consentement_commercial: boolean;
  consentement_newsletter: boolean;
}

export interface FormContact {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise: string;
  sujet: string;
  message: string;
  consentement_commercial: boolean;
}

// ========================================
// API RESPONSES - TYPES BUSINESS
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// ========================================
// CONSTANTES BUSINESS
// ========================================

export const SECTEURS_ACTIVITE = [
  'restaurant',
  'coiffeur', 
  'artisan',
  'therapeute',
  'coach',
  'service',
  'commerce',
  'autre'
] as const;

export const OBJECTIFS_PRINCIPAUX = [
  'Visibilité locale',
  'Génération de leads',
  'Vente en ligne',
  'Crédibilité professionnelle',
  'Informer mes clients',
  'Réservations en ligne'
] as const;

export const DELAIS_SOUHAITES = [
  'Urgent (2 semaines)',
  'Dans le mois',
  '2-3 mois',
  'Pas pressé'
] as const;

export const BUDGETS_RANGES = [
  { min: 0, max: 1000, label: 'Moins de 1000€' },
  { min: 1000, max: 2000, label: '1000€ - 2000€' },
  { min: 2000, max: 3500, label: '2000€ - 3500€' },
  { min: 3500, max: 999999, label: 'Plus de 3500€' }
] as const;

export type SecteurActivite = typeof SECTEURS_ACTIVITE[number];
export type ObjectifPrincipal = typeof OBJECTIFS_PRINCIPAUX[number];
export type DelaiSouhaite = typeof DELAIS_SOUHAITES[number];
