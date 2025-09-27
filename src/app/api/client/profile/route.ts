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

    // Récupérer le profil client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        *,
        nb_demandes_devis:demandes_devis(count),
        nb_demandes_audit:demandes_audit(count)
      `)
      .eq('auth_user_id', session.user.id)
      .eq('actif', true)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Profil client non trouvé' },
        { status: 404 }
      );
    }

    // Enrichir avec les données Supabase Auth
    const clientData = {
      ...client,
      email_confirme_supabase: !!session.user.email_confirmed_at,
      derniere_connexion_supabase: session.user.last_sign_in_at,
      nb_demandes_devis: client.nb_demandes_devis?.[0]?.count || 0,
      nb_demandes_audit: client.nb_demandes_audit?.[0]?.count || 0
    };

    return NextResponse.json({
      success: true,
      client: clientData
    });

  } catch (error) {
    console.error('Erreur API profile:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const {
      nom,
      prenom,
      telephone,
      entreprise,
      secteur_activite,
      commune,
      preferences_json
    } = body;

    // Mettre à jour le profil
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update({
        nom,
        prenom,
        telephone,
        entreprise,
        secteur_activite,
        commune,
        preferences_json,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', session.user.id)
      .eq('actif', true)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur mise à jour profil:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      client: updatedClient,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur API profile PATCH:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
