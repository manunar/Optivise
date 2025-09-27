import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  console.log('🚀 [DEBUG] API /api/client/register POST appelée');
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
    const body = await request.json();
    console.log('🚀 [DEBUG] Body reçu:', body);

    const {
      auth_user_id,
      email,
      nom,
      prenom,
      entreprise,
      telephone,
      secteur_activite,
      commune,
      source_inscription = 'direct',
      accepte_conditions,
      accepte_newsletter
    } = body;

    // Validation des données obligatoires
    if (!auth_user_id || !email || !nom || !prenom || !entreprise) {
      return NextResponse.json(
        { error: 'Données obligatoires manquantes' },
        { status: 400 }
      );
    }

    if (!accepte_conditions) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions d\'utilisation' },
        { status: 400 }
      );
    }

    // Vérifier si le client existe déjà
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (existingClient) {
      // Client existe déjà, juste lier le compte auth
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update({
          auth_user_id,
          email_verifie: false,
          actif: true,
          source_inscription: 'compte_cree',
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select(`
          *,
          nb_demandes_devis:demandes_devis(count),
          nb_demandes_audit:demandes_audit(count)
        `)
        .single();

      if (updateError) {
        console.error('Erreur mise à jour client:', updateError);
        return NextResponse.json(
          { error: 'Erreur lors de la création du compte' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        client: {
          ...updatedClient,
          nb_demandes_devis: updatedClient.nb_demandes_devis?.[0]?.count || 0,
          nb_demandes_audit: updatedClient.nb_demandes_audit?.[0]?.count || 0
        },
        message: 'Compte lié avec succès'
      });
    }

    // Créer un nouveau client
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({
        auth_user_id,
        email,
        nom,
        prenom,
        entreprise,
        telephone: telephone || null,
        secteur_activite: secteur_activite || null,
        commune: commune || null,
        email_verifie: false,
        actif: true,
        source_inscription,
        preferences_json: {
          notifications_email: accepte_newsletter || false,
          notifications_sms: false,
          langue: 'fr',
          theme: 'light'
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur création client:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    // Lier les demandes existantes par email
    await supabase
      .from('demandes_devis')
      .update({ client_id: newClient.id })
      .eq('email', email)
      .is('client_id', null);

    await supabase
      .from('demandes_audit')
      .update({ client_id: newClient.id })
      .eq('email', email)
      .is('client_id', null);

    return NextResponse.json({
      success: true,
      client: {
        ...newClient,
        nb_demandes_devis: 0,
        nb_demandes_audit: 0
      },
      message: 'Compte créé avec succès'
    });

  } catch (error) {
    console.error('❌ [DEBUG] Erreur API register:', error);
    console.error('❌ [DEBUG] Stack trace:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
