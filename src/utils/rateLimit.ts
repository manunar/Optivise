/**
 * Simple rate limiting basé sur la mémoire
 * Pour une solution production, utilisez Redis ou une base de données
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Map pour stocker les tentatives par IP
const rateLimitMap = new Map<string, RateLimitEntry>();

// Nettoyer les entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Vérifie si une IP a dépassé la limite de requêtes
 * @param ip Adresse IP du client
 * @param maxRequests Nombre maximum de requêtes autorisées
 * @param windowMs Fenêtre de temps en millisecondes
 * @returns true si la limite est dépassée
 */
export function isRateLimited(
  ip: string, 
  maxRequests: number = 10, 
  windowMs: number = 10 * 60 * 1000 // 10 minutes par défaut
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // Première requête ou fenêtre expirée
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true; // Limite dépassée
  }

  // Incrémenter le compteur
  entry.count++;
  return false;
}

/**
 * Obtient l'adresse IP du client depuis la requête
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy (Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (ne fonctionne pas toujours en production)
  return 'unknown';
}

/**
 * Middleware de rate limiting pour les API routes
 */
export function checkRateLimit(
  request: Request,
  maxRequests: number = 10,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; ip: string } {
  const ip = getClientIP(request);
  const limited = isRateLimited(ip, maxRequests, windowMs);
  
  return {
    allowed: !limited,
    ip
  };
}
