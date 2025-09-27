# Mapping Fonctionnalités → Options du Catalogue

Correspondance entre les fonctionnalités proposées dans le questionnaire et les options de votre catalogue.

## 🎨 **Catégorie Design**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Galerie de photos | `galerie_photos` | - | Galerie d'images responsive |
| Design personnalisé | `design_personnalise` | 165.00€ | Création d'une charte graphique unique |
| Carte interactive | `carte_interactive` | 45.00€ | Carte Google Maps intégrée avec localisation |
| Module blog | `module_blog` | 80.00€ | Section blog pour publier articles, actualités |
| Avis clients | `avis_clients` | - | Système d'avis et témoignages clients |
| Pages supplémentaires | `page_supplementaire` | 30.00€ | Pages additionnelles (À propos, Tarifs, etc.) |

## 📞 **Catégorie Contact**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Formulaire de contact | `formulaire_contact` | 40.00€ | Formulaire de contact avec protection anti-spam |
| Prise de rendez-vous | `prise_rendez_vous` | - | Système de prise de rendez-vous intégré |
| Réservation en ligne | `reservation_ligne` | 80.00€ | Système de prise de rendez-vous intégré |
| Newsletter intégrée | `newsletter_integree` | 70.00€ | Système de newsletter avec formulaires |
| Chat en direct | `chat_direct` | - | Widget de chat en temps réel |

## 🛠️ **Catégorie Technique**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Maintenance annuelle | `maintenance_annuelle` | 600.00€ | Support technique, mises à jour sécurité |
| Sauvegardes automatiques | `sauvegardes_auto` | 30.00€ | Système de sauvegarde automatique quotidien |
| Certificat SSL | `certificat_ssl_inclus` | 0.00€ | HTTPS sécurisé gratuitement avec Let's Encrypt |
| Domaine + Hébergement | `domaine_hebergement` | 120.00€ | Renouvellement domaine et hébergement |
| Support technique | `support_technique` | - | Assistance technique et formation |

## 📊 **Catégorie Marketing**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Google Analytics | `google_analytics` | 40.00€ | Installation et configuration Google Analytics |
| Optimisation SEO | `integration_seo_google` | 30.00€ | Affichage automatique de vos sites Google |
| Réseaux sociaux | `marketing_reseaux_sociaux` | 30.00€ | Liens et intégrations réseaux sociaux |
| Google Maps | `optimisation_google_maps` | 80.00€ | Optimisation Google Maps |
| Pixel Facebook | `pixel_facebook` | 300.00€ | Version complète de votre site en français |
| Newsletter | `newsletter_integree` | 70.00€ | Système de newsletter avec formulaires |

## 💳 **Catégorie E-commerce**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Paiement en ligne | `paiement_en_ligne` | 150.00€ | Intégration Stripe/PayPal avec paiements |
| Système panier | `systeme_panier_clients` | 90.00€ | Collecte et affichage d'avis clients avec |
| Gestion commandes | `gestion_commandes` | - | Interface de gestion des commandes |
| Facturation automatique | `facturation_automatique` | - | Génération automatique de factures |

## 📱 **Catégorie Pratique**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Horaires d'ouverture | `horaires_ouverture` | - | Affichage des horaires d'ouverture |
| Plan d'accès | `plan_acces` | - | Carte et indications d'accès |
| Localisation GPS | `localisation_gps` | - | Géolocalisation précise |
| Mentions légales | `mentions_legales` | - | Pages légales obligatoires |

## 🔧 **Fonctionnalités Avancées**

| Fonctionnalité Questionnaire | Code Option Catalogue | Prix | Description |
|------------------------------|----------------------|------|-------------|
| Espace client privé | `espace_client_prive` | - | Zone privée pour les clients |
| Multi-langues | `systeme_multi_langues` | - | Site en plusieurs langues |
| API personnalisée | `api_personnalisee` | - | Développement d'API sur mesure |
| Base de données clients | `base_donnees_clients` | - | Gestion centralisée des clients |

## 💡 **Utilisation Pratique**

1. **Dans le questionnaire** : L'utilisateur sélectionne "Galerie de photos"
2. **Dans la DB** : La réponse a `recommandations = ["galerie_photos"]`
3. **Génération automatique** : Le système recommande l'option `galerie_photos` du catalogue
4. **Devis automatique** : Prix et description récupérés automatiquement

Cette approche garantit une cohérence parfaite entre le questionnaire et votre catalogue d'options !
