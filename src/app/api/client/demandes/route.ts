import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Vérifier l'authentification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .eq('actif', true)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les demandes de devis
    const { data: demandesDevis, error: devisError } = await supabase
      .from('demandes_devis')
      .select(`
        id,
        created_at,
        prix_estime_ht,
        prix_estime_ttc,
        entreprise,
        statut,
        mode_creation
      `)
      .or(`client_id.eq.${client.id},email.eq.${session.user.email}`)
      .order('created_at', { ascending: false });

    // Récupérer les demandes d'audit
    const { data: demandesAudit, error: auditError } = await supabase
      .from('demandes_audit')
      .select(`
        id,
        created_at,
        url_site_actuel,
        entreprise,
        statut
      `)
      .or(`client_id.eq.${client.id},email.eq.${session.user.email}`)
      .order('created_at', { ascending: false });

    if (devisError || auditError) {
      console.error('Erreur récupération demandes:', { devisError, auditError });
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des demandes' },
        { status: 500 }
      );
    }

    // Combiner et formater les demandes
    const demandes = [
      ...(demandesDevis || []).map(demande => ({
        ...demande,
        type: 'devis' as const
      })),
      ...(demandesAudit || []).map(demande => ({
        ...demande,
        type: 'audit' as const
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      demandes,
      total: demandes.length,
      stats: {
        devis: demandesDevis?.length || 0,
        audit: demandesAudit?.length || 0
      }
    });

  } catch (error) {
    console.error('Erreur API demandes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
