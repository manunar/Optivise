/**
 * API Route: /api/configurateur/recommandations
 * Calcule les options recommandées à partir des réponses utilisateur
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedOptions } from '@/backend/database/configurateur';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // body: { reponses: { [question_code]: [reponse_code, ...] } }
    const result = await getRecommendedOptions(body.reponses);
    if (!result.success) {
      return NextResponse.json({ error: 'Erreur lors du calcul des recommandations' }, { status: 500 });
    }
    return NextResponse.json({ success: true, options: result.options, sessionId: result.sessionId });
  } catch (error) {
    console.error('Erreur API recommandations configurateur:', error);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
}
