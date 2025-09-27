// Fonctions pour l'API configurateur (questions & recommandations)
import { createAdminSupabaseClient } from '@/backend/supabase/server';

export async function getQuestionsWithReponses() {
  try {
    const supabase = createAdminSupabaseClient();
    
    console.log('🔍 Connexion Supabase établie');
    
    // Récupérer toutes les questions
    const { data: questions, error: errorQuestions } = await supabase
      .from('questionnaire_questions')
      .select('id, question, type_question, categorie, ordre_affichage')
      .order('ordre_affichage', { ascending: true });
      
    console.log('📋 Questions récupérées:', questions?.length, 'Erreur:', errorQuestions);
    if (errorQuestions) return { success: false, error: errorQuestions.message };

    // Récupérer toutes les réponses depuis questionnaire_reponses (question_id = int)
    const { data: reponsesRaw, error: errorReponses } = await supabase
      .from('questionnaire_reponses')
      .select('id, question_id, reponse, ordre_affichage, recommandations')
      .order('question_id, ordre_affichage');
      
    console.log('💬 Réponses récupérées:', reponsesRaw?.length, 'Erreur:', errorReponses);
    if (errorReponses) return { success: false, error: errorReponses.message };

    // Utiliser directement les recommandations de questionnaire_reponses
    const reponses = reponsesRaw || [];

    return { success: true, questions, reponses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRecommendedOptions(reponses: Record<string, string | string[]>) {
  try {
    const supabase = createAdminSupabaseClient();
    
    // Récupérer les questions pour formater les réponses
    const { data: questions, error: questionsError } = await supabase
      .from('questionnaire_questions')
      .select('id, question')
      .order('ordre_affichage');
    
    if (questionsError) {
      console.error('Erreur récupération questions:', questionsError);
    }
    
    // Version simplifiée : récupérer les options recommandées depuis questionnaire_reponses
    const optionsRecommandees = new Set<string>();
    
    // Pour chaque réponse de l'utilisateur
    for (const [questionId, reponseValue] of Object.entries(reponses)) {
      // Gérer les réponses multiples et simples
      const reponseTexts = Array.isArray(reponseValue) ? reponseValue : [reponseValue];
      
      for (const reponseText of reponseTexts) {
        // Trouver la réponse correspondante dans questionnaire_reponses
        const { data: reponseData, error } = await supabase
          .from('questionnaire_reponses')
          .select('recommandations')
          .eq('question_id', parseInt(questionId))
          .eq('reponse', reponseText as string)
          .single();
        
        if (!error && reponseData?.recommandations) {
          // Ajouter les options recommandées
          let options: string[] = [];
          
          if (Array.isArray(reponseData.recommandations)) {
            // Si c'est déjà un tableau, l'utiliser directement
            options = reponseData.recommandations as string[];
          } else if (typeof reponseData.recommandations === 'string') {
            // Si c'est une chaîne JSON, la parser
            try {
              options = JSON.parse(reponseData.recommandations);
            } catch (e) {
              console.error('Erreur parsing JSON recommandations:', e);
              options = [];
            }
          }
          
          options.forEach((option: string) => optionsRecommandees.add(option));
        }
      }
    }
    
    // Formater les réponses avec les questions
    const reponsesFormatees = Object.entries(reponses).map(([questionId, reponseValue]) => {
      const question = questions?.find(q => q.id.toString() === questionId);
      return {
        questionId: parseInt(questionId),
        question: question?.question || `Question ${questionId}`,
        reponse: reponseValue
      };
    });
    
    // Créer une session temporaire
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      success: true, 
      options: Array.from(optionsRecommandees), 
      sessionId,
      reponses_questionnaire: reponses,
      reponses_formatees: reponsesFormatees
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
