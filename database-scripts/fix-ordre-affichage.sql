-- Script pour corriger les ordres d'affichage des réponses
-- Éviter les conflits après l'ajout des nouvelles réponses

-- Voir les réponses actuelles pour la question 4
SELECT id, question_id, reponse, ordre_affichage 
FROM questionnaire_reponses 
WHERE question_id = 4 
ORDER BY ordre_affichage;

-- Réorganiser les ordres d'affichage pour éviter les conflits
-- Commencer par les réponses existantes (1-6), puis les nouvelles (7+)

-- Mise à jour des nouvelles réponses pour avoir des ordres séquentiels
UPDATE questionnaire_reponses 
SET ordre_affichage = 7 
WHERE question_id = 4 AND code = 'design_unique';

UPDATE questionnaire_reponses 
SET ordre_affichage = 8 
WHERE question_id = 4 AND code = 'blog_actualites';

UPDATE questionnaire_reponses 
SET ordre_affichage = 9 
WHERE question_id = 4 AND code = 'carte_localisation';

UPDATE questionnaire_reponses 
SET ordre_affichage = 10 
WHERE question_id = 4 AND code = 'newsletter_clients';

UPDATE questionnaire_reponses 
SET ordre_affichage = 11 
WHERE question_id = 4 AND code = 'visibilite_google';

UPDATE questionnaire_reponses 
SET ordre_affichage = 12 
WHERE question_id = 4 AND code = 'analytics_visites';

UPDATE questionnaire_reponses 
SET ordre_affichage = 13 
WHERE question_id = 4 AND code = 'reseaux_sociaux';

UPDATE questionnaire_reponses 
SET ordre_affichage = 14 
WHERE question_id = 4 AND code = 'site_securise';

UPDATE questionnaire_reponses 
SET ordre_affichage = 15 
WHERE question_id = 4 AND code = 'support_technique';

UPDATE questionnaire_reponses 
SET ordre_affichage = 16 
WHERE question_id = 4 AND code = 'mentions_legales';

UPDATE questionnaire_reponses 
SET ordre_affichage = 17 
WHERE question_id = 4 AND code = 'vente_en_ligne';

UPDATE questionnaire_reponses 
SET ordre_affichage = 18 
WHERE question_id = 4 AND code = 'gestion_commandes';

-- Vérification finale
SELECT id, question_id, code, reponse, ordre_affichage 
FROM questionnaire_reponses 
WHERE question_id = 4 
ORDER BY ordre_affichage;
