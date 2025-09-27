/**
 * API Route: /api/admin/leads
 * Gestion des leads pour l'admin - TODO: Implémenter
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implémenter la récupération des leads
  return NextResponse.json({ 
    success: true,
    data: []
  });
}