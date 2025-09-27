/**
 * API Route: /api/sessions
 * Gestion des sessions de configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession, saveSessionProgress } from '@/backend/database/sessions';

/**
 * POST /api/sessions
 * Créer une nouvelle session ou sauvegarder des réponses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, session_token, reponses, statut } = body;
    
    if (action === 'create') {
      // Créer une nouvelle session
      const result = await createSession(reponses || {});
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        data: result.data 
      });
      
    } else if (action === 'save') {
      // Sauvegarder les réponses dans une session existante
      if (!session_token || !reponses) {
        return NextResponse.json(
          { error: 'session_token et reponses requis pour la sauvegarde' },
          { status: 400 }
        );
      }
      
      const result = await saveSessionProgress(session_token, reponses, statut);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        data: result.data 
      });
      
    } else {
      return NextResponse.json(
        { error: 'Action non reconnue. Utilisez "create" ou "save"' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Erreur API sessions:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
