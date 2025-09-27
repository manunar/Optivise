# Fonctionnalité de Sélection Multiple

## Vue d'ensemble

Cette fonctionnalité permet aux questions du questionnaire de configuration d'accepter plusieurs réponses au lieu d'une seule. Elle est particulièrement utile pour des questions comme "Quels services vous intéressent ?" où l'utilisateur peut sélectionner plusieurs options.

## Implémentation

### 1. Base de données

Un nouveau champ `multiple_selection` (BOOLEAN) a été ajouté à la table `questionnaire_questions` :

```sql
ALTER TABLE questionnaire_questions 
ADD COLUMN multiple_selection BOOLEAN DEFAULT FALSE;
```

### 2. Frontend

- **Interface utilisateur** : Les questions à sélection multiple affichent des checkboxes au lieu de boutons radio
- **Gestion d'état** : Les réponses multiples sont stockées sous forme d'array de strings
- **Validation** : Une question à sélection multiple est considérée comme répondue si au moins une option est sélectionnée

### 3. Backend

- **API** : L'endpoint `/api/configurateur/recommandations` accepte maintenant des réponses sous forme d'arrays
- **Traitement** : Chaque réponse sélectionnée est traitée individuellement pour générer les recommandations

## Utilisation

### Pour marquer une question comme acceptant les sélections multiples :

```sql
UPDATE questionnaire_questions 
SET multiple_selection = TRUE 
WHERE id = [ID_DE_LA_QUESTION];
```

### Exemples de questions appropriées pour les sélections multiples :

- "Quels types de services vous intéressent ?"
- "Dans quels domaines avez-vous besoin d'aide ?"
- "Quelles fonctionnalités sont prioritaires pour vous ?"
- "Quels canaux de communication préférez-vous ?"

## Interface utilisateur

### Questions à sélection simple (multiple_selection = false)
- Affichage : Boutons radio avec cercles colorés
- Comportement : Une seule sélection possible
- Indicateur : "Sélectionnez une réponse"

### Questions à sélection multiple (multiple_selection = true)
- Affichage : Checkboxes avec style personnalisé
- Comportement : Plusieurs sélections possibles
- Indicateur : "Sélectionnez une ou plusieurs réponses"
- Résumé : Les réponses sélectionnées sont affichées sous forme de badges

## Structure des données

### Réponses utilisateur

```typescript
// Sélection simple
userAnswers[questionId] = "Réponse unique"

// Sélection multiple  
userAnswers[questionId] = ["Réponse 1", "Réponse 2", "Réponse 3"]
```

### Traitement backend

```typescript
// Le backend traite automatiquement les deux formats
for (const [questionId, reponseValue] of Object.entries(reponses)) {
  const reponseTexts = Array.isArray(reponseValue) ? reponseValue : [reponseValue];
  // Traitement unifié...
}
```

## Migration

Pour migrer une base de données existante :

1. Exécutez le script SQL `database-migrations/add-multiple-selection-field.sql`
2. Identifiez les questions qui devraient accepter les sélections multiples
3. Mettez à jour ces questions avec `multiple_selection = TRUE`
4. Testez le questionnaire pour vérifier le bon fonctionnement

## Compatibilité

- ✅ Compatible avec les questions existantes (par défaut `multiple_selection = FALSE`)
- ✅ Pas de changement requis pour les questions à sélection simple
- ✅ Les recommandations fonctionnent avec les deux types de questions
- ✅ L'interface s'adapte automatiquement selon le type de question
