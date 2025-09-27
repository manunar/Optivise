-- Ajouter des réponses simples à la question "Quelles fonctionnalités sont importantes pour vous ?"
-- Ces réponses sont volontairement non-techniques et orientées bénéfices client

-- Réponses existantes vues dans la DB (question_id = 4) :
-- - Galerie de photos
-- - Formulaire de contact  
-- - Prise de rendez-vous
-- - Avis clients
-- - Plan d'accès
-- - Horaires d'ouverture

-- Ajouter SEULEMENT les nouvelles réponses qui manquent
-- (Les réponses existantes sont conservées)
INSERT INTO questionnaire_reponses (question_id, code, reponse, ordre_affichage, recommandations) VALUES

-- 🎨 Nouvelles fonctionnalités visuelles (les basiques existent déjà)
(4, 'design_unique', 'Avoir un design unique qui me ressemble', 7, '["design_personnalise"]'),
(4, 'blog_actualites', 'Partager des actualités et conseils', 8, '["module_blog"]'),
(4, 'carte_localisation', 'Montrer ma localisation sur une carte', 9, '["carte_interactive"]'),

-- 📞 Nouvelles fonctionnalités contact (formulaire et RDV existent déjà)
(4, 'newsletter_clients', 'Envoyer des actualités à mes clients', 10, '["newsletter_integree"]'),

-- 📊 Visibilité et marketing (nouvelles)
(4, 'visibilite_google', 'Être bien visible sur Google', 11, '["integration_seo_google", "optimisation_google_maps"]'),
(4, 'analytics_visites', 'Suivre qui visite mon site', 12, '["google_analytics"]'),
(4, 'reseaux_sociaux', 'Connecter mes réseaux sociaux', 13, '["marketing_reseaux_sociaux"]'),

-- 🛡️ Sécurité et maintenance
(4, 'site_securise', 'Avoir un site sécurisé et maintenu', 14, '["certificat_ssl_inclus", "maintenance_annuelle", "sauvegardes_auto"]'),
(4, 'support_technique', 'Bénéficier d''un support technique', 15, '["support_technique"]'),

-- 📱 Informations pratiques (horaires et plan d'accès existent déjà)
(4, 'mentions_legales', 'Avoir toutes les mentions légales', 16, '["mentions_legales"]'),

-- 💳 E-commerce (si applicable)
(4, 'vente_en_ligne', 'Vendre mes produits/services en ligne', 17, '["paiement_en_ligne", "systeme_panier_clients"]'),
(4, 'gestion_commandes', 'Gérer mes commandes automatiquement', 18, '["gestion_commandes", "facturation_automatique"]');

-- Vérification des réponses ajoutées
SELECT 
    r.id,
    r.reponse,
    r.ordre_affichage,
    r.recommandations
FROM questionnaire_reponses r
WHERE r.question_id = 4
ORDER BY r.ordre_affichage;
