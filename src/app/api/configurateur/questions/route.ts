/**
 * API Route: /api/configurateur/questions
 * Récupère toutes les questions et leurs réponses possibles
 */

import { NextResponse } from 'next/server';
import { getQuestionsWithReponses } from '@/backend/database/configurateur';

export async function GET() {
  try {
    console.log('🔍 Début récupération questions configurateur...');
    const result = await getQuestionsWithReponses();
    
    if (!result.success) {
      console.error('❌ Erreur dans getQuestionsWithReponses:', result.error);
      return NextResponse.json({ error: result.error || 'Erreur lors de la récupération des questions' }, { status: 500 });
    }
    
    console.log('✅ Questions récupérées:', result.questions?.length || 0);
    console.log('✅ Réponses récupérées:', result.reponses?.length || 0);
    
    return NextResponse.json({ success: true, questions: result.questions, reponses: result.reponses });
  } catch (error) {
    console.error('❌ Erreur API questions configurateur:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur interne', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}
