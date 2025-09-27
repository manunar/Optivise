import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireRole } from '@/backend/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Vérification d'authentification admin
    await requireRole(['admin', 'super_admin']);

    const { data: auditRequests, error } = await supabase
      .from('demandes_audit')
      .select(`
        id,
        email,
        nom,
        prenom,
        entreprise,
        telephone,
        url_site_actuel,
        problemes_identifies,
        objectifs_souhaites,
        taille_site_estimee,
        budget_envisage,
        delai_souhaite,
        message_auto_genere,
        commentaires_libres,
        statut,
        priorite,
        assignee_id,
        created_at,
        updated_at,
        date_audit_prevue,
        rapport_audit_url,
        recommandations,
        devis_genere_id
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur admin API');
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des demandes d\'audit' },
        { status: 500 }
      );
    }

    // Pour les demandes d'audit, l'URL est directement disponible
    const requestsWithUrl = auditRequests?.map((auditRequest: any) => ({
      ...auditRequest,
      url_site: auditRequest.url_site_actuel
    })) || [];

    return NextResponse.json({
      success: true,
      requests: requestsWithUrl
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes('Role required')) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }
    
    console.error('Erreur admin API');
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
