/**
 * API Route: /api/demandes
 * Gestion des demandes de devis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createDemandeDevis } from '@/backend/database/demandes';
import { FormDemandeDevisSchema } from '@/backend/validations/demande';
import { checkRateLimit } from '@/utils/rateLimit';
import { sanitizeString, sanitizeEmail } from '@/utils/sanitize';

/**
 * POST /api/demandes
 * Créer une nouvelle demande de devis
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification du rate limiting (10 requêtes par 10 minutes par IP)
    const { allowed, ip } = checkRateLimit(request, 10, 10 * 60 * 1000);
    if (!allowed) {
      console.log(`Rate limit dépassé pour IP: ${ip}`);
      return NextResponse.json(
        { error: 'Trop de demandes. Veuillez patienter avant de réessayer.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Log minimal pour monitoring
    console.log('Nouvelle demande de devis reçue');
    
    // Sanitisation des champs texte
    if (body.nom) body.nom = sanitizeString(body.nom, 50);
    if (body.prenom) body.prenom = sanitizeString(body.prenom, 50);
    if (body.email) body.email = sanitizeEmail(body.email);
    if (body.entreprise) body.entreprise = sanitizeString(body.entreprise, 100);
    if (body.telephone) body.telephone = sanitizeString(body.telephone, 50);
    if (body.commune) body.commune = sanitizeString(body.commune, 100);
    if (body.situation_actuelle) body.situation_actuelle = sanitizeString(body.situation_actuelle, 500);
    if (body.contenus_disponibles) body.contenus_disponibles = sanitizeString(body.contenus_disponibles, 300);
    if (body.commentaires_libres) body.commentaires_libres = sanitizeString(body.commentaires_libres, 1000);
    
    // Les chaînes vides sont acceptées par le schéma, pas de conversion nécessaire
    
    // Validation des données
    const validation = FormDemandeDevisSchema.safeParse(body);
    if (!validation.success) {
      console.log('Erreur validation demande');
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }
    
    // Création de la demande
    const result = await createDemandeDevis(validation.data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Erreur lors de la création' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result.data 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur API demandes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}