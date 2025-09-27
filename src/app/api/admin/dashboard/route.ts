/**
 * API Route: /api/admin/dashboard
 * Dashboard administrateur - TODO: Implémenter
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implémenter les statistiques dashboard
  return NextResponse.json({ 
    success: true,
    data: {
      message: 'Dashboard API - À implémenter',
      stats: {}
    }
  });
}