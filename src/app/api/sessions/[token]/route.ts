/**
 * API Route: /api/sessions/[token]
 * Gestion d'une session spécifique
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSessionRecommendations, completeSession, deleteSession } from '@/backend/database/sessions';

/**
 * GET /api/sessions/[token]
 * Récupérer une session par son token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    const result = await getSession(token);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result.data 
    });
    
  } catch (error) {
    console.error('Erreur récupération session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sessions/[token]
 * Mettre à jour une session (recommandations, statut, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { action, options_recommandees } = body;
    
    if (action === 'update_recommendations') {
      if (!options_recommandees || !Array.isArray(options_recommandees)) {
        return NextResponse.json(
          { error: 'options_recommandees requis et doit être un tableau' },
          { status: 400 }
        );
      }
      
      const result = await updateSessionRecommendations(token, options_recommandees);
      
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
      
    } else if (action === 'complete') {
      const result = await completeSession(token);
      
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
        { error: 'Action non reconnue. Utilisez "update_recommendations" ou "complete"' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Erreur mise à jour session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sessions/[token]
 * Supprimer une session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    const result = await deleteSession(token);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true 
    });
    
  } catch (error) {
    console.error('Erreur suppression session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
