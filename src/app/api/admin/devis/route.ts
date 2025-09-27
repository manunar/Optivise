/**
 * API Route: /api/admin/devis
 * Gestion des demandes de devis pour l'admin
 */

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

    const { data: devisRequests, error } = await supabase
      .from('demandes_devis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des demandes de devis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: devisRequests || []
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