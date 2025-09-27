import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireRole } from '@/backend/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification d'authentification admin
    await requireRole(['admin', 'super_admin']);

    const { id } = await params;
    const body = await request.json();
    const { statut } = body;

    // Validation du statut
    const validStatuses = ['nouveau', 'contacte', 'audit_planifie', 'devis_envoye', 'termine'];
    if (statut && !validStatuses.includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (statut) updateData.statut = statut;

    const { data, error } = await supabase
      .from('demandes_audit')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      request: data
    });

  } catch (error) {
    console.error('Erreur API update audit-request:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification d'authentification admin
    await requireRole(['admin', 'super_admin']);

    const { id } = await params;

    const { data: request_data, error } = await supabase
      .from('demandes_audit')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération' },
        { status: 500 }
      );
    }

    if (!request_data) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    // Pour les demandes d'audit, l'URL est directement disponible
    return NextResponse.json({
      success: true,
      request: {
        ...request_data,
        url_site: request_data.url_site_actuel
      }
    });

  } catch (error) {
    console.error('Erreur API get audit-request:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification d'authentification admin
    await requireRole(['admin', 'super_admin']);

    const { id } = await params;

    // Vérifier que la demande existe avant de la supprimer
    const { data: existingRequest, error: checkError } = await supabase
      .from('demandes_audit')
      .select('id, nom, email')
      .eq('id', id)
      .single();

    if (checkError || !existingRequest) {
      return NextResponse.json(
        { error: 'Demande d\'audit non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la demande d'audit
    const { error: deleteError } = await supabase
      .from('demandes_audit')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erreur lors de la suppression:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la demande' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Demande d'audit de ${existingRequest.nom} (${existingRequest.email}) supprimée avec succès`,
      deletedRequest: existingRequest
    });

  } catch (error) {
    console.error('Erreur API delete audit-request:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// Gestion d'erreurs d'authentification commune
function handleAuthError(error: unknown) {
  if (error instanceof Error && error.message === 'Authentication required') {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }
  if (error instanceof Error && error.message.includes('Role required')) {
    return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
  }
  
  console.error('Erreur admin API');
  return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
}
