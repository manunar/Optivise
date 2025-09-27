import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { token_hash, type } = await request.json();

    if (!token_hash || type !== 'email') {
      return NextResponse.json(
        { error: 'Paramètres de vérification invalides' },
        { status: 400 }
      );
    }

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

    // Vérifier le token avec Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });

    if (error) {
      console.error('Erreur vérification OTP:', error);
      
      // Gérer les différents types d'erreurs
      if (error.message.includes('already been verified')) {
        return NextResponse.json({
          success: false,
          error: 'already_verified',
          message: 'Email déjà vérifié'
        });
      }
      
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Lien de vérification expiré ou invalide' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'email' },
        { status: 500 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérification réussie
    console.log('✅ Email vérifié avec succès pour:', data.user.email);

    // Mettre à jour le statut dans la table clients si nécessaire
    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          email_verifie: true,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', data.user.id);

      if (updateError) {
        console.error('Erreur mise à jour table clients:', updateError);
        // Ne pas faire échouer la vérification pour autant
      }
    } catch (updateError) {
      console.error('Erreur mise à jour table clients:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Email vérifié avec succès',
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error('Erreur API auth callback:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Gérer aussi les requêtes GET pour les redirections directes depuis l'email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next') || '/client/dashboard';

    if (!token_hash || type !== 'email') {
      // Rediriger vers une page d'erreur
      return NextResponse.redirect(new URL('/auth/callback?error=invalid_link', request.url));
    }

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

    // Vérifier le token avec Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });

    if (error) {
      console.error('Erreur vérification OTP (GET):', error);
      return NextResponse.redirect(new URL('/auth/callback?error=verification_failed', request.url));
    }

    if (data.user) {
      // Mettre à jour le statut dans la table clients
      try {
        await supabase
          .from('clients')
          .update({ 
            email_verifie: true,
            updated_at: new Date().toISOString()
          })
          .eq('auth_user_id', data.user.id);
      } catch (updateError) {
        console.error('Erreur mise à jour table clients (GET):', updateError);
      }

      console.log('✅ Email vérifié avec succès (GET) pour:', data.user.email);
      
      // Rediriger vers la page de succès
      return NextResponse.redirect(new URL(`/auth/callback?success=true&next=${encodeURIComponent(next)}`, request.url));
    }

    return NextResponse.redirect(new URL('/auth/callback?error=user_not_found', request.url));

  } catch (error) {
    console.error('Erreur API auth callback (GET):', error);
    return NextResponse.redirect(new URL('/auth/callback?error=server_error', request.url));
  }
}
