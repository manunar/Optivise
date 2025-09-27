/**
 * API Route de test: /api/configurateur/test
 * Pour diagnostiquer les problèmes de connexion Supabase
 */

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/backend/supabase/server';

export async function GET() {
  try {
    console.log('🧪 Test de connexion Supabase...');
    
    const supabase = createAdminSupabaseClient();
    
    // Test simple : compter les questions
    const { data: questions, error: errorQuestions } = await supabase
      .from('questionnaire_questions')
      .select('id, question')
      .limit(5);
      
    if (errorQuestions) {
      console.error('❌ Erreur questions:', errorQuestions);
      return NextResponse.json({ 
        error: 'Erreur questions', 
        details: errorQuestions 
      }, { status: 500 });
    }
    
    // Test simple : compter les réponses
    const { data: reponses, error: errorReponses } = await supabase
      .from('questionnaire_reponses')
      .select('id, reponse')
      .limit(5);
      
    if (errorReponses) {
      console.error('❌ Erreur réponses:', errorReponses);
      return NextResponse.json({ 
        error: 'Erreur réponses', 
        details: errorReponses 
      }, { status: 500 });
    }
    
    console.log('✅ Test réussi');
    
    return NextResponse.json({ 
      success: true, 
      questionsCount: questions?.length || 0,
      reponsesCount: reponses?.length || 0,
      sampleQuestions: questions,
      sampleReponses: reponses
    });
    
  } catch (error) {
    console.error('❌ Erreur test API:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}
