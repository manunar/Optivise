# Configuration de la Vérification d'Email

## Vue d'ensemble

Le système de vérification d'email est maintenant complet avec :
- ✅ Page de vérification `/client/verify-email`
- ✅ API de renvoi d'email `/api/client/resend-verification`
- ✅ Page de callback `/auth/callback`
- ✅ API de traitement `/api/auth/callback`

## Configuration Supabase Requise

### 1. URL de Redirection

Dans le dashboard Supabase, aller dans **Authentication > URL Configuration** et ajouter :

```
Site URL: https://votre-domaine.com
Redirect URLs: 
  - https://votre-domaine.com/auth/callback
  - http://localhost:3000/auth/callback (pour le développement)
```

### 2. Templates d'Email

Dans **Authentication > Email Templates**, configurer le template "Confirm signup" :

**Subject:** `Confirmez votre adresse email - Optivise`

**Body (HTML):**
```html
<h2>Confirmez votre adresse email</h2>
<p>Merci de vous être inscrit sur Optivise !</p>
<p>Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
<p>L'équipe Optivise</p>
```

### 3. Variables d'Environnement

Vérifier que ces variables sont configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Workflow de Vérification

### 1. Inscription
1. Utilisateur s'inscrit via `/client/register`
2. Supabase envoie automatiquement un email de vérification
3. Redirection vers `/client/verify-email`

### 2. Vérification
1. Utilisateur clique sur le lien dans l'email
2. Supabase redirige vers `/auth/callback?token_hash=...&type=email`
3. La page callback traite la vérification
4. Redirection vers le dashboard client

### 3. Renvoi d'Email
1. Depuis `/client/verify-email`, bouton "Renvoyer l'email"
2. Appel à `/api/client/resend-verification`
3. Nouveau lien envoyé par Supabase

## États de Vérification

### Dashboard Client
- ✅ Alerte si email non vérifié
- ✅ Statistiques incluent le statut de vérification
- ✅ Lien vers la page de vérification

### Page de Vérification
- ✅ Instructions claires
- ✅ Bouton de renvoi d'email
- ✅ Gestion des erreurs

### Page de Callback
- ✅ États : loading, success, error, already_verified
- ✅ Messages d'erreur spécifiques
- ✅ Redirection automatique
- ✅ Actions de récupération

## Gestion d'Erreurs

### Erreurs Communes
- **Lien expiré** : Redirection vers page de renvoi
- **Lien invalide** : Message d'erreur avec options
- **Email déjà vérifié** : Confirmation et redirection
- **Utilisateur non trouvé** : Message d'erreur approprié

### Logs
- ✅ Logs de vérification réussie
- ✅ Logs d'erreurs avec détails
- ✅ Mise à jour de la table clients

## Test du Système

### 1. Test d'Inscription
```bash
# 1. Créer un nouveau compte
# 2. Vérifier la réception de l'email
# 3. Cliquer sur le lien de vérification
# 4. Vérifier la redirection vers le dashboard
```

### 2. Test de Renvoi
```bash
# 1. Aller sur /client/verify-email
# 2. Cliquer sur "Renvoyer l'email"
# 3. Vérifier la réception du nouvel email
```

### 3. Test d'Erreurs
```bash
# 1. Utiliser un lien expiré
# 2. Utiliser un lien invalide
# 3. Vérifier les messages d'erreur appropriés
```

## Sécurité

### Mesures Implémentées
- ✅ Validation des tokens côté serveur
- ✅ Gestion sécurisée des erreurs (pas d'exposition de détails)
- ✅ Mise à jour atomique de la base de données
- ✅ Logs sécurisés sans informations sensibles

### Bonnes Pratiques
- Les tokens sont validés par Supabase
- Les erreurs sont génériques côté client
- Les logs détaillés sont côté serveur uniquement
- Redirection sécurisée après vérification

## Maintenance

### Monitoring
- Surveiller les logs de vérification
- Vérifier les taux de succès/échec
- Monitorer les emails non délivrés

### Mise à Jour
- Tester après chaque déploiement
- Vérifier les URLs de redirection
- Valider les templates d'email
