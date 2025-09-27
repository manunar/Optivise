# Configuration CAPTCHA pour la production

## 🔧 Configuration Cloudflare Turnstile (Recommandé)

### 1. Créer un site Turnstile
1. Aller sur https://dash.cloudflare.com/
2. Aller dans "Turnstile" dans le menu latéral
3. Cliquer "Add site"
4. Configurer :
   - **Site name** : Optivise Contact Form
   - **Domain** : votre-domaine.com
   - **Widget Mode** : Managed (recommandé)

### 2. Récupérer les clés
Après création, vous obtiendrez :
- **Site Key** (publique) : `0x4AAA...` 
- **Secret Key** (privée) : `0x4BBB...`

### 3. Configurer les variables d'environnement
Ajouter dans `.env.local` :
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...
TURNSTILE_SECRET_KEY=0x4BBB...
```

### 4. Remplacer SimpleCaptcha par Turnstile

Dans `AuditRefonteForm.tsx` :
```tsx
import { Turnstile } from '@/frontend/components/ui/captcha';

// Remplacer SimpleCaptcha par :
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  onSuccess={(token) => {
    setCaptchaToken(token);
    setErreurValidation('');
  }}
  onError={() => {
    setCaptchaToken(null);
    setErreurValidation('Erreur de vérification. Veuillez réessayer.');
  }}
  theme="dark"
/>
```

### 5. Vérifier le token côté serveur

Dans `audit-refonte/route.ts` :
```typescript
// Vérification Turnstile
const captchaToken = rawData.captcha_token;
if (!captchaToken) {
  return NextResponse.json(
    { error: 'Vérification anti-spam requise' },
    { status: 400 }
  );
}

// Vérifier le token avec Cloudflare
const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: captchaToken,
    remoteip: getClientIP(request) // optionnel
  })
});

const turnstileResult = await turnstileResponse.json();
if (!turnstileResult.success) {
  return NextResponse.json(
    { error: 'Vérification anti-spam échouée' },
    { status: 400 }
  );
}
```

## 🧪 Configuration actuelle (Développement)

Actuellement configuré avec **SimpleCaptcha** :
- ✅ Question mathématique simple (ex: 5 + 3 = ?)
- ✅ Validation côté client et serveur
- ✅ Token généré : `simple_captcha_${timestamp}_${random}`
- ✅ Fonctionne immédiatement sans configuration

## 🚀 Migration vers Turnstile

1. **Développement** : SimpleCaptcha (actuel)
2. **Production** : Turnstile (suivre les étapes ci-dessus)

## 📊 Comparaison

| Aspect | SimpleCaptcha | Turnstile |
|--------|---------------|-----------|
| **Sécurité** | Basique | Très élevée |
| **UX** | Question math | Invisible/minimal |
| **Setup** | Immédiat | 5 min config |
| **Coût** | Gratuit | Gratuit |
| **Bypass** | Facile | Très difficile |

## 🔄 Prochaines étapes

1. **Tester** SimpleCaptcha en développement
2. **Configurer** Turnstile pour la production
3. **Déployer** avec la protection complète
