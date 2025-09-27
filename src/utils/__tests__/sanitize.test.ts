/**
 * Tests pour les fonctions de sanitisation
 * Exécuter avec: npm test sanitize
 */

import { 
  stripHtml, 
  sanitizeString, 
  sanitizeArray, 
  sanitizeEmail, 
  sanitizeUrl, 
  sanitizePhone,
  sanitizeAuditData 
} from '../sanitize';

describe('Sanitisation des données', () => {
  
  describe('stripHtml', () => {
    test('supprime les balises HTML', () => {
      expect(stripHtml('<script>alert("xss")</script>Hello')).toBe('Hello');
      expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
      expect(stripHtml('<img src="x" onerror="alert(1)">')).toBe('');
    });

    test('décode les entités HTML', () => {
      expect(stripHtml('&lt;script&gt;')).toBe('<script>');
      expect(stripHtml('&amp; &quot; &#x27;')).toBe('& " \'');
    });

    test('normalise les espaces', () => {
      expect(stripHtml('  Hello    world  ')).toBe('Hello world');
      expect(stripHtml('Line1\n\n\nLine2')).toBe('Line1 Line2');
    });

    test('limite la longueur', () => {
      expect(stripHtml('Hello world', 5)).toBe('Hello');
    });
  });

  describe('sanitizeEmail', () => {
    test('valide les emails corrects', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('USER@DOMAIN.COM')).toBe('user@domain.com');
    });

    test('rejette les emails invalides', () => {
      expect(sanitizeEmail('invalid-email')).toBe('');
      expect(sanitizeEmail('test@')).toBe('');
      expect(sanitizeEmail('@domain.com')).toBe('');
    });

    test('nettoie les espaces', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });
  });

  describe('sanitizeUrl', () => {
    test('ajoute https:// si manquant', () => {
      expect(sanitizeUrl('example.com')).toBe('https://example.com/');
      expect(sanitizeUrl('www.example.com')).toBe('https://www.example.com/');
    });

    test('garde les URLs complètes', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    test('rejette les protocoles dangereux', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizeUrl('ftp://example.com')).toBe('');
    });
  });

  describe('sanitizePhone', () => {
    test('garde les caractères valides', () => {
      expect(sanitizePhone('+33 1 23 45 67 89')).toBe('+33 1 23 45 67 89');
      expect(sanitizePhone('01-23-45-67-89')).toBe('01-23-45-67-89');
    });

    test('supprime les caractères invalides', () => {
      expect(sanitizePhone('01.23.45.67.89')).toBe('01234567890');
      expect(sanitizePhone('01 23 45 67 89 ext123')).toBe('01 23 45 67 89 123');
    });
  });

  describe('sanitizeArray', () => {
    test('sanitise chaque élément', () => {
      const input = ['<script>alert(1)</script>Hello', 'World<b>!</b>'];
      const result = sanitizeArray(input);
      expect(result).toEqual(['Hello', 'World!']);
    });

    test('limite le nombre d\'éléments', () => {
      const input = ['a', 'b', 'c', 'd', 'e'];
      const result = sanitizeArray(input, 3);
      expect(result).toHaveLength(3);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('filtre les éléments vides', () => {
      const input = ['Hello', '', '   ', 'World'];
      const result = sanitizeArray(input);
      expect(result).toEqual(['Hello', 'World']);
    });
  });

  describe('sanitizeAuditData', () => {
    test('sanitise toutes les données', () => {
      const input = {
        email: '  TEST@EXAMPLE.COM  ',
        nom: '<script>alert(1)</script>Dupont',
        entreprise: 'Ma <b>Super</b> Entreprise',
        url_site_actuel: 'example.com',
        problemes_identifies: ['<i>Problème 1</i>', 'Problème 2'],
        message_auto_genere: 'Message avec <script>du HTML</script>',
        consentement_commercial: 'true' // string au lieu de boolean
      };

      const result = sanitizeAuditData(input);

      expect(result.email).toBe('test@example.com');
      expect(result.nom).toBe('Dupont');
      expect(result.entreprise).toBe('Ma Super Entreprise');
      expect(result.url_site_actuel).toBe('https://example.com/');
      expect(result.problemes_identifies).toEqual(['Problème 1', 'Problème 2']);
      expect(result.message_auto_genere).toBe('Message avec du HTML');
      expect(result.consentement_commercial).toBe(true);
    });

    test('gère les données manquantes', () => {
      const input = {};
      const result = sanitizeAuditData(input);

      expect(result.email).toBe('');
      expect(result.nom).toBe('');
      expect(result.problemes_identifies).toEqual([]);
      expect(result.consentement_commercial).toBe(false);
    });
  });
});
