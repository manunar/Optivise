-- ========================================
-- MIGRATION SÉCURISÉE - AUTHENTIFICATION CLIENT
-- ========================================

-- 1. Créer la table clients avec sécurité renforcée
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) UNIQUE,
  
  -- Informations personnelles (obligatoires)
  email text UNIQUE NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text,
  
  -- Informations entreprise (obligatoires)
  entreprise text NOT NULL,
  secteur_activite text,
  commune text,
  
  -- Authentification et statut
  email_verifie boolean DEFAULT false,
  actif boolean DEFAULT true,
  date_derniere_connexion timestamptz,
  preferences_json jsonb DEFAULT '{}',
  
  -- Métadonnées
  source_inscription text DEFAULT 'direct', -- 'direct', 'demande_devis', 'demande_audit'
  notes_internes text[],
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contraintes de sécurité
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT nom_length CHECK (length(nom) >= 2 AND length(nom) <= 50),
  CONSTRAINT prenom_length CHECK (length(prenom) >= 2 AND length(prenom) <= 50),
  CONSTRAINT entreprise_length CHECK (length(entreprise) >= 2 AND length(entreprise) <= 100)
);

-- 2. Créer un index pour les performances
CREATE INDEX idx_clients_auth_user_id ON clients(auth_user_id);
CREATE INDEX idx_clients_email ON clients(email);

-- 3. Créer une fonction pour lier automatiquement les comptes
CREATE OR REPLACE FUNCTION link_client_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Quand un client se crée un compte, lier automatiquement
  -- ses demandes existantes basées sur l'email
  UPDATE demandes_devis 
  SET client_id = NEW.id 
  WHERE email = NEW.email AND client_id IS NULL;
  
  UPDATE demandes_audit 
  SET client_id = NEW.id 
  WHERE email = NEW.email AND client_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger
CREATE TRIGGER trigger_link_client_to_auth
  AFTER INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION link_client_to_auth();

-- 5. Ajouter une colonne client_id aux tables de demandes (si pas déjà fait)
-- ALTER TABLE demandes_devis ADD COLUMN client_id uuid REFERENCES clients(id);
-- ALTER TABLE demandes_audit ADD COLUMN client_id uuid REFERENCES clients(id);

-- 6. Créer une vue pour les clients authentifiés
CREATE VIEW clients_authentifies AS
SELECT 
  c.*,
  au.email_confirmed_at IS NOT NULL as email_confirme_supabase,
  au.last_sign_in_at as derniere_connexion_supabase
FROM clients c
LEFT JOIN auth.users au ON c.auth_user_id = au.id
WHERE c.auth_user_id IS NOT NULL;

-- 7. RLS (Row Level Security) pour les clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Politique : Les clients ne peuvent voir que leurs propres données
CREATE POLICY "clients_own_data" ON clients
  FOR ALL USING (auth.uid() = auth_user_id);

-- Politique : Les admins peuvent tout voir
CREATE POLICY "admin_full_access" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM utilisateurs_internes ui
      WHERE ui.auth_user_id = auth.uid()
      AND ui.role IN ('admin', 'super_admin')
      AND ui.actif = true
    )
  );
