-- Script pour ajouter les questions de fonctionnalités
-- Basé sur le catalogue d'options existant

-- 1. Question sur les fonctionnalités visuelles (choix multiple)
INSERT INTO questionnaire_questions (question, type_question, categories, ordre_affichage) 
VALUES ('Quelles fonctionnalités visuelles sont importantes pour vous ?', 'choix_multiple', 'design', 5);

-- Récupérer l'ID de la question qu'on vient d'insérer
-- (Remplacez X par l'ID réel après insertion)
SET @question_design_id = LAST_INSERT_ID();

-- Réponses pour la question design
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES
(@question_design_id, 'Galerie de photos', 1, '["galerie_photos"]'),
(@question_design_id, 'Design personnalisé', 2, '["design_personnalise"]'),
(@question_design_id, 'Carte interactive', 3, '["carte_interactive"]'),
(@question_design_id, 'Module blog', 4, '["module_blog"]'),
(@question_design_id, 'Avis clients', 5, '["avis_clients"]'),
(@question_design_id, 'Pages supplémentaires', 6, '["page_supplementaire"]');

-- 2. Question sur les outils marketing (choix multiple)
INSERT INTO questionnaire_questions (question, type_question, categories, ordre_affichage) 
VALUES ('Quels outils marketing souhaitez-vous intégrer ?', 'choix_multiple', 'marketing', 6);

SET @question_marketing_id = LAST_INSERT_ID();

-- Réponses pour la question marketing
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES
(@question_marketing_id, 'Google Analytics', 1, '["google_analytics"]'),
(@question_marketing_id, 'Optimisation SEO', 2, '["integration_seo_google"]'),
(@question_marketing_id, 'Réseaux sociaux', 3, '["marketing_reseaux_sociaux"]'),
(@question_marketing_id, 'Google Maps', 4, '["optimisation_google_maps"]'),
(@question_marketing_id, 'Pixel Facebook', 5, '["pixel_facebook"]'),
(@question_marketing_id, 'Newsletter', 6, '["newsletter_integree"]');

-- 3. Question sur les services techniques (choix multiple)
INSERT INTO questionnaire_questions (question, type_question, categories, ordre_affichage) 
VALUES ('Quels services techniques vous intéressent ?', 'choix_multiple', 'technique', 7);

SET @question_technique_id = LAST_INSERT_ID();

-- Réponses pour la question technique
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES
(@question_technique_id, 'Maintenance annuelle', 1, '["maintenance_annuelle"]'),
(@question_technique_id, 'Sauvegardes automatiques', 2, '["sauvegardes_auto"]'),
(@question_technique_id, 'Certificat SSL', 3, '["certificat_ssl_inclus"]'),
(@question_technique_id, 'Domaine + Hébergement', 4, '["domaine_hebergement"]'),
(@question_technique_id, 'Support technique', 5, '["support_technique"]');

-- 4. Question sur les fonctionnalités de contact (choix multiple)
INSERT INTO questionnaire_questions (question, type_question, categories, ordre_affichage) 
VALUES ('Comment souhaitez-vous que vos clients vous contactent ?', 'choix_multiple', 'contact', 8);

SET @question_contact_id = LAST_INSERT_ID();

-- Réponses pour la question contact
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES
(@question_contact_id, 'Formulaire de contact', 1, '["formulaire_contact"]'),
(@question_contact_id, 'Prise de rendez-vous', 2, '["prise_rendez_vous"]'),
(@question_contact_id, 'Réservation en ligne', 3, '["reservation_ligne"]'),
(@question_contact_id, 'Chat en direct', 4, '["chat_direct"]');

-- 5. Question sur les informations pratiques (choix multiple)
INSERT INTO questionnaire_questions (question, type_question, categories, ordre_affichage) 
VALUES ('Quelles informations pratiques voulez-vous afficher ?', 'choix_multiple', 'pratique', 9);

SET @question_pratique_id = LAST_INSERT_ID();

-- Réponses pour la question pratique
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES
(@question_pratique_id, 'Horaires d\'ouverture', 1, '["horaires_ouverture"]'),
(@question_pratique_id, 'Plan d\'accès', 2, '["plan_acces"]'),
(@question_pratique_id, 'Localisation GPS', 3, '["localisation_gps"]'),
(@question_pratique_id, 'Mentions légales', 4, '["mentions_legales"]');

-- Vérification des questions ajoutées
SELECT 
    q.id,
    q.question,
    q.type_question,
    q.categories,
    COUNT(r.id) as nb_reponses
FROM questionnaire_questions q
LEFT JOIN questionnaire_reponses r ON q.id = r.question_id
WHERE q.ordre_affichage >= 5
GROUP BY q.id, q.question, q.type_question, q.categories
ORDER BY q.ordre_affichage;
