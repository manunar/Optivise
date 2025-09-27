-- ========================================
-- VÉRIFICATION STRUCTURE TABLE CLIENTS
-- ========================================

-- 1. Voir la structure complète de la table clients
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;

-- 2. Voir les contraintes existantes
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'clients';

-- 3. Voir les index existants
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'clients';

-- 4. Voir les données existantes (échantillon)
SELECT 
    id,
    email,
    nom,
    prenom,
    entreprise,
    created_at
FROM clients 
LIMIT 5;

-- 5. Compter les enregistrements
SELECT COUNT(*) as total_clients FROM clients;
