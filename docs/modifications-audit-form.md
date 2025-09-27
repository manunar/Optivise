# Modifications à apporter à AuditRefonteForm.tsx

## 1. Ajouter les props pour l'intégration

Modifier l'interface `AuditRefonteFormProps` :

```typescript
interface AuditRefonteFormProps {
  onBack?: () => void;
  onSubmit?: (data: any) => Promise<void>; // NOUVEAU
  isSubmitting?: boolean; // NOUVEAU
  error?: string | null; // NOUVEAU
}
```

## 2. Modifier la fonction handleSubmit

Remplacer la logique d'envoi dans `handleSubmit` :

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isFormValid() || !captchaToken) {
    setErreurValidation('Veuillez remplir tous les champs obligatoires et valider le captcha.');
    return;
  }

  // Si onSubmit est fourni (mode avec auth), l'utiliser
  if (onSubmit) {
    const auditData = {
      // Informations client
      email: formData.email,
      nom: formData.nom,
      prenom: formData.prenom,
      entreprise: formData.entreprise,
      telephone: formData.telephone,
      
      // Détails audit
      url_site_actuel: formData.url_site_actuel,
      problemes_identifies: [...formData.problemes_identifies, ...formData.problemes_personnalises],
      objectifs_souhaites: [...formData.objectifs_souhaites, ...formData.objectifs_personnalises],
      
      // Message et consentements
      message_auto_genere: messageAutoGenere,
      commentaires_libres: formData.commentaires_libres,
      consentement_commercial: formData.consentement_commercial,
      consentement_newsletter: formData.consentement_newsletter,
      
      // Captcha
      captcha_token: captchaToken
    };

    await onSubmit(auditData);
    return;
  }

  // Sinon, logique d'envoi directe existante
  // ... votre code existant
};
```

## 3. Utiliser les props pour l'état de soumission

Modifier l'état de soumission :

```typescript
// Utiliser isSubmitting de props si fourni, sinon l'état local
const submittingState = isSubmitting !== undefined ? isSubmitting : isSubmitting;
```

## 4. Afficher l'erreur des props

Ajouter l'affichage d'erreur après les autres erreurs :

```typescript
{/* Erreur de validation */}
{erreurValidation && (
  <Alert className="border-red-700 bg-red-900/20">
    <AlertCircle className="h-4 w-4 text-red-400" />
    <AlertDescription className="text-red-300">
      {erreurValidation}
    </AlertDescription>
  </Alert>
)}

{/* NOUVEAU: Erreur des props */}
{error && (
  <Alert className="border-red-700 bg-red-900/20">
    <AlertCircle className="h-4 w-4 text-red-400" />
    <AlertDescription className="text-red-300">
      {error}
    </AlertDescription>
  </Alert>
)}
```

## 5. Utilisation

Remplacer l'utilisation d'AuditRefonteForm par AuditRefonteFormWithAuth dans les pages qui en ont besoin.

Dans `/audit-refonte/page.tsx` :

```typescript
import AuditRefonteFormWithAuth from '@/frontend/components/pages/AuditRefonteFormWithAuth';

export default function AuditRefontePage() {
  return <AuditRefonteFormWithAuth />;
}
```
