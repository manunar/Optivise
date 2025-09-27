/**
 * Types de base de données Supabase générés automatiquement
 * ✅ Fichier généré depuis Supabase CLI le 21/09/2025
 * 
 * Pour régénérer : npx supabase gen types typescript --project-id zlijlmrrqfpzexbbdazc
 */

// Export du type Database et des utilitaires générés
export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from './database-generated';

// Types simplifiés pour l'utilisation dans l'application
import type { Tables, Enums } from './database-generated';

export type DemandeDevis = Tables<'demandes_devis'>;
export type OptionsCatalogue = Tables<'options_catalogue'>;
export type UtilisateurInterne = Tables<'utilisateurs_internes'>;
export type Communication = Tables<'communications'>;
export type DevisFinal = Tables<'devis_finaux'>;
export type Client = Tables<'clients'>;
export type Commande = Tables<'commandes'>;
export type CommandeOption = Tables<'commande_options'>;
export type Projet = Tables<'projets'>;
export type PortfolioSimple = Tables<'portfolio_simple'>;

// Types pour le système de questionnaire
export type QuestionnaireQuestion = Tables<'questionnaire_questions'>;
export type QuestionnaireReponse = Tables<'questionnaire_reponses'>;
export type ReponsePossible = Tables<'reponses_possibles'>;
export type SessionConfiguration = Tables<'sessions_configuration'>;

// Types pour les demandes d'audit
export type DemandeAudit = Tables<'demandes_audit'>;

// Types des enums
export type StatutDemande = Enums<'statut_demande'>;
export type TypeOption = Enums<'type_option'>;
export type RoleUtilisateur = Enums<'role_utilisateur'>;
export type TypeCommunication = Enums<'type_communication'>;
export type StatutDevis = Enums<'statut_devis'>;