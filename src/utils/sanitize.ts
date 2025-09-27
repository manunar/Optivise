/**
 * Utilitaires de sanitisation et validation pour les données utilisateur
 * Protège contre XSS, injection HTML, et normalise les contenus
 */

/**
 * Supprime toutes les balises HTML et normalise le texte
 */
export function stripHtml(input: string, maxLen = 2000): string {
  if (!input) return '';
  
  // 1. Supprimer toutes les balises HTML
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // 2. Décoder les entités HTML communes
  const decoded = withoutTags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
  
  // 3. Normaliser les espaces (remplacer espaces multiples par un seul)
  const normalized = decoded.replace(/\s+/g, ' ').trim();
  
  // 4. Limiter la longueur
  return normalized.slice(0, maxLen);
}

/**
 * Sanitise une chaîne de caractères
 */
export function sanitizeString(input?: string, maxLen = 2000): string {
  if (!input || typeof input !== 'string') return '';
  return stripHtml(input, maxLen);
}

/**
 * Sanitise un tableau de chaînes
 */
export function sanitizeArray(arr?: string[], maxItems = 20, itemMaxLen = 120): string[] {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .slice(0, maxItems) // Limiter le nombre d'éléments
    .map(item => sanitizeString(String(item), itemMaxLen))
    .filter(Boolean); // Supprimer les éléments vides
}

/**
 * Valide et normalise une adresse email
 */
export function sanitizeEmail(email?: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleaned) || cleaned.length > 255) {
    return '';
  }
  
  return cleaned;
}

/**
 * Valide et normalise une URL
 */
export function sanitizeUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const cleaned = url.trim();
  
  // Ajouter https:// si pas de protocole
  let normalizedUrl = cleaned;
  if (!/^https?:\/\//i.test(cleaned)) {
    normalizedUrl = `https://${cleaned}`;
  }
  
  try {
    const urlObj = new URL(normalizedUrl);
    // Vérifier que c'est bien http ou https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    return urlObj.toString().slice(0, 512);
  } catch {
    return '';
  }
}

/**
 * Valide et normalise un numéro de téléphone
 */
export function sanitizePhone(phone?: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Garder seulement les chiffres, espaces, tirets, parenthèses et le +
  const cleaned = phone.replace(/[^\d\s\-\(\)\+]/g, '').trim();
  
  return cleaned.slice(0, 50);
}

/**
 * Interface pour les données d'audit sanitisées
 */
export interface SanitizedAuditData {
  email: string;
  nom: string;
  prenom: string;
  entreprise: string;
  telephone: string;
  url_site_actuel: string;
  problemes_identifies: string[];
  problemes_personnalises: string[];
  objectifs_souhaites: string[];
  objectifs_personnalises: string[];
  taille_site_estimee: string;
  budget_envisage: string;
  delai_souhaite: string;
  message_auto_genere: string;
  commentaires_libres: string;
  consentement_commercial: boolean;
  consentement_newsletter: boolean;
}

/**
 * Sanitise complètement les données d'une demande d'audit
 */
export function sanitizeAuditData(data: any): SanitizedAuditData {
  return {
    email: sanitizeEmail(data.email),
    nom: sanitizeString(data.nom, 120),
    prenom: sanitizeString(data.prenom, 120),
    entreprise: sanitizeString(data.entreprise, 180),
    telephone: sanitizePhone(data.telephone),
    url_site_actuel: sanitizeUrl(data.url_site_actuel),
    
    // Listes guidées
    problemes_identifies: sanitizeArray(data.problemes_identifies, 10, 150),
    problemes_personnalises: sanitizeArray(data.problemes_personnalises, 5, 200),
    objectifs_souhaites: sanitizeArray(data.objectifs_souhaites, 10, 150),
    objectifs_personnalises: sanitizeArray(data.objectifs_personnalises, 5, 200),
    
    // Champs de sélection
    taille_site_estimee: sanitizeString(data.taille_site_estimee, 120),
    budget_envisage: sanitizeString(data.budget_envisage, 120),
    delai_souhaite: sanitizeString(data.delai_souhaite, 120),
    
    // Champs libres longs
    message_auto_genere: sanitizeString(data.message_auto_genere, 4000),
    commentaires_libres: sanitizeString(data.commentaires_libres, 4000),
    
    // Consentements
    consentement_commercial: Boolean(data.consentement_commercial),
    consentement_newsletter: Boolean(data.consentement_newsletter),
  };
}
