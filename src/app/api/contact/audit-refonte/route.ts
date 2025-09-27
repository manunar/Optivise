/**
 * API Route: /api/contact/audit-refonte
 * Gère les demandes d'audit pour les sites existants obsolètes
 */

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/backend/supabase/server';
import { sanitizeAuditData, type SanitizedAuditData } from '@/utils/sanitize';
import { checkRateLimit } from '@/utils/rateLimit';

interface DemandeAuditData {
  // Informations client
  email: string;
  nom: string;
  prenom?: string;
  entreprise: string;
  telephone?: string;
  
  // Détails de l'audit
  url_site_actuel: string;
  problemes_identifies: string[];
  problemes_personnalises?: string[];
  objectifs_souhaites: string[];
  objectifs_personnalises?: string[];
  taille_site_estimee?: string;
  budget_envisage?: string;
  delai_souhaite?: string;
  
  // Message
  message_auto_genere: string;
  commentaires_libres?: string;
  
  // Consentements RGPD
  consentement_commercial?: boolean;
  consentement_newsletter?: boolean;
}

export async function POST(request: Request) {
  try {
    console.log('🔍 Début traitement demande audit refonte...');
    
    // Vérification du rate limiting (5 requêtes par 10 minutes par IP)
    const { allowed, ip } = checkRateLimit(request, 5, 10 * 60 * 1000);
    if (!allowed) {
      console.log(`Rate limit dépassé pour IP: ${ip}`);
      return NextResponse.json(
        { error: 'Trop de demandes. Veuillez patienter avant de réessayer.' },
        { status: 429 }
      );
    }
    
    const rawData = await request.json();
    
    // Sanitisation complète des données
    const data: SanitizedAuditData = sanitizeAuditData(rawData);
    
    // Vérification du CAPTCHA
    const captchaToken = rawData.captcha_token;
    if (!captchaToken || !captchaToken.startsWith('simple_captcha_')) {
      return NextResponse.json(
        { error: 'Vérification anti-spam requise' },
        { status: 400 }
      );
    }

    // Validation des champs obligatoires après sanitisation
    if (!data.email || !data.nom || !data.entreprise || !data.url_site_actuel || !data.message_auto_genere) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants ou invalides' },
        { status: 400 }
      );
    }
    
    const supabase = createAdminSupabaseClient();
    
    // Les données sont déjà sanitisées, on peut les utiliser directement
    const tousProblemes = [
      ...data.problemes_identifies,
      ...data.problemes_personnalises
    ];
    
    const tousObjectifs = [
      ...data.objectifs_souhaites,
      ...data.objectifs_personnalises
    ];
    
    // Insertion dans la table demandes_audit
    const { data: demandeAudit, error } = await supabase
      .from('demandes_audit')
      .insert({
        // Informations client
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        entreprise: data.entreprise,
        telephone: data.telephone,
        
        // Détails audit
        url_site_actuel: data.url_site_actuel,
        problemes_identifies: tousProblemes,
        objectifs_souhaites: tousObjectifs,
        taille_site_estimee: data.taille_site_estimee,
        
        // Message
        message_auto_genere: data.message_auto_genere,
        commentaires_libres: data.commentaires_libres,
        
        // Statut initial
        statut: 'nouveau',
        priorite: 5,
        
        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur insertion audit');
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de la demande' },
        { status: 500 }
      );
    }
    
    console.log('✅ Demande audit créée:', demandeAudit.id);
    
    // TODO: Envoyer email de notification à l'équipe
    // TODO: Envoyer email de confirmation au client
    
    return NextResponse.json({
      success: true,
      message: 'Demande d\'audit enregistrée avec succès',
      demande_id: demandeAudit.id
    });
    
  } catch (error) {
    console.error('Erreur API audit refonte');
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
