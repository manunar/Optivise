# Modifications à apporter à DemandeDevisPage.tsx

## 1. Ajouter les imports nécessaires

En haut du fichier, ajouter :

```typescript
import ClientChoiceModal from '@/frontend/components/auth/ClientChoiceModal';
import type { ChoixUtilisateur } from '@/shared/types/client';
```

## 2. Ajouter les états pour le modal

Après les autres useState :

```typescript
const [showClientChoice, setShowClientChoice] = useState(false);
const [pendingSubmission, setPendingSubmission] = useState<any>(null);
```

## 3. Modifier la fonction handleSubmit

Remplacer le contenu de `handleSubmit` par :

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid()) return;
  
  // Préparer les données pour l'API demandes
  const demandeData = {
    // Configuration (obligatoire)
    configuration_json: {
      session_id: sessionId,
      options_selectionnees: options.map(opt => ({
        id: opt.id,
        nom: opt.nom,
        prix: opt.prix_ht
      })),
      total_estime: prixHT,
      source: 'configurateur_assisté'
    },
    prix_estime_ht: prixHT,
    prix_estime_ttc: prixTTC,
    mode_creation: 'assiste',

    // Contact (obligatoire)
    email: formData.email,
    nom: formData.nom,
    prenom: formData.prenom,
    telephone: formData.telephone || '',
    entreprise: formData.entreprise,
    commune: '',

    // Contexte business (récupéré depuis la session du questionnaire)
    secteur_activite: undefined,
    objectif_principal: undefined,
    situation_actuelle: '',
    budget_max: undefined,
    delai_souhaite: undefined,

    // Informations complémentaires
    contenus_disponibles: '',
    commentaires_libres: formData.message || '',

    // RGPD
    consentement_commercial: true,
    consentement_newsletter: false
  };

  // Au lieu d'envoyer directement, stocker et afficher le choix client
  setPendingSubmission(demandeData);
  setShowClientChoice(true);
};
```

## 4. Ajouter la fonction de gestion du choix client

Après handleSubmit :

```typescript
const handleClientChoice = async (choice: ChoixUtilisateur) => {
  if (!pendingSubmission) return;
  
  setSubmitting(true);
  
  try {
    let finalData = { ...pendingSubmission };
    
    // Si l'utilisateur choisit de créer un compte ou se connecter
    if (choice.mode !== 'invite') {
      finalData.client_mode = choice.mode;
      finalData.client_data = {
        email: choice.email,
        nom: choice.nom,
        prenom: choice.prenom,
        entreprise: choice.entreprise
      };
    }

    const response = await fetch('/api/demandes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    });

    if (response.ok) {
      const result = await response.json();
      
      // Rediriger selon le choix
      if (choice.mode === 'inscription') {
        router.push(`/client/register?email=${encodeURIComponent(choice.email || '')}&redirect=/client/dashboard`);
      } else if (choice.mode === 'connexion') {
        router.push(`/client/login?email=${encodeURIComponent(choice.email || '')}&redirect=/client/dashboard`);
      } else {
        // Mode invité - page de confirmation classique
        router.push(`/confirmation?id=${result.data?.id}`);
      }
    } else {
      throw new Error('Erreur lors de l\'envoi');
    }
  } catch (error) {
    console.error('Erreur:', error);
    setError('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
  } finally {
    setSubmitting(false);
    setPendingSubmission(null);
  }
};
```

## 5. Ajouter le modal avant la fermeture du composant

Avant le `</div>` final :

```typescript
{/* Modal de choix client */}
<ClientChoiceModal
  isOpen={showClientChoice}
  onClose={() => {
    setShowClientChoice(false);
    setPendingSubmission(null);
  }}
  onChoice={handleClientChoice}
  userEmail={formData.email}
  userName={`${formData.prenom} ${formData.nom}`}
  userCompany={formData.entreprise}
/>
```

## 6. Résultat attendu

Après ces modifications :

1. **Utilisateur remplit le formulaire** → Clic "Envoyer ma demande"
2. **Modal s'affiche** → Choix entre "Invité", "Connexion", "Inscription"
3. **Selon le choix** :
   - **Invité** → Envoi direct + page de confirmation
   - **Connexion** → Redirection vers login client
   - **Inscription** → Redirection vers register client
