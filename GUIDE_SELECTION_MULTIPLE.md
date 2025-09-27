# Guide : Utiliser les sélections multiples

## 🚀 C'est déjà prêt !

Votre base de données a déjà une colonne `type_question` avec les valeurs :
- `choix_unique` → Boutons radio (une seule sélection)
- `choix_multiple` → Checkboxes (plusieurs sélections)

## ✅ Pour activer les sélections multiples

### Changer le type d'une question existante :
```sql
-- Exemple : Changer la question ID 4 en sélection multiple
UPDATE questionnaire_questions 
SET type_question = 'choix_multiple' 
WHERE id = 4;

-- Ou plusieurs questions à la fois :
UPDATE questionnaire_questions 
SET type_question = 'choix_multiple' 
WHERE id IN (4, 6, 8);
```

### Voir toutes vos questions et leur type :
```sql
SELECT id, question, type_question 
FROM questionnaire_questions 
ORDER BY ordre_affichage;
```

## 🎯 Résultat automatique

- **`type_question = 'choix_unique'`** → Interface avec boutons radio
- **`type_question = 'choix_multiple'`** → Interface avec checkboxes

## 💡 Questions appropriées pour `choix_multiple`

D'après votre capture d'écran, la question ID 4 "Quelles fonctionnalités sont importantes" est déjà en `choix_multiple` - parfait !

Autres exemples :
- "Quels services vous intéressent ?"
- "Dans quels domaines avez-vous besoin d'aide ?"
- "Quels canaux de communication préférez-vous ?"

## ✅ Aucune migration nécessaire !

L'interface s'adapte automatiquement selon la valeur de `type_question` dans votre base de données existante.
