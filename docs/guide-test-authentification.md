# Guide de Test - Authentification Client

## 🧪 **Tests à effectuer**

### **1. Test de la migration SQL**
```sql
-- Vérifier que la migration s'est bien passée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'clients';
```

### **2. Test d'inscription client**

#### **Scénario 1 : Nouveau client**
1. Aller sur `/client/register`
2. Remplir le formulaire avec un nouvel email
3. Vérifier la création du compte Supabase Auth
4. Vérifier la création de l'enregistrement dans `clients`
5. Vérifier la redirection vers `/client/verify-email`

#### **Scénario 2 : Client existant (email déjà en base)**
1. Utiliser un email qui existe déjà dans `clients`
2. S'inscrire avec cet email
3. Vérifier que le compte se lie à l'enregistrement existant
4. Vérifier que `auth_user_id` est mis à jour

### **3. Test de connexion client**
1. Aller sur `/client/login`
2. Se connecter avec les identifiants créés
3. Vérifier la redirection vers `/client/dashboard`
4. Vérifier que les données du profil s'affichent correctement

### **4. Test du dashboard client**
1. Vérifier l'affichage des statistiques
2. Vérifier l'affichage des demandes (si il y en a)
3. Tester les liens vers le profil
4. Tester la déconnexion

### **5. Test du modal de choix**

#### **Via formulaire d'audit :**
1. Aller sur `/audit-refonte`
2. Remplir le formulaire `AuditRefonteForm`
3. Cliquer sur "Envoyer"
4. **PROBLÈME** : Le modal ne s'affichera pas car il faut utiliser `AuditRefonteFormWithAuth`

#### **Via formulaire de devis :**
1. Aller sur `/configurateur` puis `/demande-devis`
2. Remplir le formulaire
3. Cliquer sur "Envoyer ma demande"
4. **PROBLÈME** : Le modal ne s'affichera pas car les modifications ne sont pas appliquées

### **6. Test des APIs client**
```bash
# Test API profil (nécessite un token JWT)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/client/profile

# Test API demandes
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/client/demandes
```

## ⚠️ **Modifications nécessaires pour les tests**

### **A. Modifier AuditRefonteForm.tsx**
Appliquer les modifications documentées dans `modifications-audit-form.md`

### **B. Modifier DemandeDevisPage.tsx**
Appliquer les modifications documentées dans `modifications-devis-page.md`

### **C. Modifier les pages qui utilisent les formulaires**

#### **Page audit-refonte :**
```typescript
// Dans /audit-refonte/page.tsx
import AuditRefonteFormWithAuth from '@/frontend/components/pages/AuditRefonteFormWithAuth';

export default function AuditRefontePage() {
  return <AuditRefonteFormWithAuth />;
}
```

### **D. Ajouter le provider d'authentification**

#### **Dans le layout principal :**
```typescript
// Dans /app/layout.tsx ou un layout parent
import { ClientAuthProvider } from '@/frontend/contexts/ClientAuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClientAuthProvider>
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}
```

## 🔧 **Dépannage**

### **Erreur : "useClientAuthContext must be used within a ClientAuthProvider"**
- Vérifier que `ClientAuthProvider` entoure les composants qui utilisent le contexte

### **Erreur : "Non authentifié" sur les APIs client**
- Vérifier que le token JWT est bien envoyé dans les headers
- Vérifier que la session Supabase est active

### **Modal de choix ne s'affiche pas**
- Vérifier que les modifications des formulaires sont appliquées
- Vérifier que `ClientChoiceModal` est bien importé

### **RLS bloque les requêtes**
- Vérifier que les politiques RLS sont correctement configurées
- Vérifier que `auth.uid()` retourne bien l'ID utilisateur

## ✅ **Checklist de validation**

- [ ] Migration SQL exécutée sans erreur
- [ ] Table `clients` étendue avec nouvelles colonnes
- [ ] RLS activé avec politiques fonctionnelles
- [ ] Inscription client fonctionne
- [ ] Connexion client fonctionne
- [ ] Dashboard client s'affiche correctement
- [ ] Modal de choix s'affiche après soumission formulaire
- [ ] Redirection selon choix utilisateur fonctionne
- [ ] APIs client sécurisées et fonctionnelles
- [ ] Profil client modifiable
- [ ] Déconnexion fonctionne

## 🚀 **Prochaines étapes après tests**

1. **Corriger les bugs** identifiés lors des tests
2. **Optimiser les performances** si nécessaire
3. **Ajouter des tests automatisés** (Jest, Cypress)
4. **Documenter** les APIs pour l'équipe
5. **Déployer** en production
