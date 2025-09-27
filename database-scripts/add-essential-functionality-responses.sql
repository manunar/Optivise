-- Version simplifiée : Réponses essentielles et non-techniques
-- Pour la question "Quelles fonctionnalités sont importantes pour vous ?"

SET @question_id = 4; -- ID de votre question

-- Supprimer les anciennes réponses
DELETE FROM questionnaire_reponses WHERE question_id = @question_id;

-- Ajouter seulement les réponses essentielles (8-10 maximum pour une bonne UX)
INSERT INTO questionnaire_reponses (question_id, reponse, ordre_affichage, recommandations) VALUES

-- Les plus demandées et compréhensibles
(@question_id, 'Montrer mes réalisations avec des photos', 1, '["galerie_photos"]'),
(@question_id, 'Permettre aux clients de me contacter', 2, '["formulaire_contact"]'),
(@question_id, 'Proposer la prise de rendez-vous', 3, '["prise_rendez_vous"]'),
(@question_id, 'Afficher les avis de mes clients', 4, '["avis_clients"]'),
(@question_id, 'Indiquer ma localisation', 5, '["plan_acces", "carte_interactive"]'),
(@question_id, 'Afficher mes horaires d\'ouverture', 6, '["horaires_ouverture"]'),
(@question_id, 'Être bien visible sur Google', 7, '["integration_seo_google"]'),
(@question_id, 'Avoir un site sécurisé et maintenu', 8, '["certificat_ssl_inclus", "maintenance_annuelle"]');

-- Vérification
SELECT 
    r.reponse,
    r.recommandations
FROM questionnaire_reponses r
WHERE r.question_id = @question_id
ORDER BY r.ordre_affichage;
