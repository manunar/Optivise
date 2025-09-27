// Types pour l'authentification client

export interface ClientAuthentifie {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  entreprise: string;
  secteur_activite?: string;
  commune?: string;
  email_verifie: boolean;
  actif: boolean;
  date_derniere_connexion?: string;
  preferences_json?: {
    notifications_email?: boolean;
    notifications_sms?: boolean;
    langue?: string;
    theme?: string;
  };
  created_at: string;
  updated_at: string;
  // Propriétés ajoutées par l'API pour le dashboard
  nb_demandes_devis: number;
  nb_demandes_audit: number;
  email_confirme_supabase: boolean;
  derniere_connexion_supabase?: string;
}

export interface ClientProfile {
  nom: string;
  prenom: string;
  telephone?: string;
  entreprise: string;
  secteur_activite?: string;
  commune?: string;
  preferences_json: {
    notifications_email: boolean;
    notifications_sms: boolean;
    langue: string;
    theme: string;
  };
}

export interface ClientLoginForm {
  email: string;
  password: string;
}

export interface ClientRegistrationForm {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  entreprise: string;
  telephone?: string;
  secteur_activite?: string;
  commune?: string;
  accepte_conditions: boolean;
  accepte_newsletter: boolean;
}

export interface ClientAuthResponse {
  success: boolean;
  message?: string;
  client?: ClientAuthentifie;
  session?: any;
  error?: {
    code: string;
    message: string;
  };
}

export interface ClientAuthContext {
  client: ClientAuthentifie | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (data: ClientLoginForm) => Promise<boolean>;
  signUp: (data: ClientRegistrationForm) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: ClientProfile) => Promise<boolean>;
  refreshClient: () => Promise<void>;
}
