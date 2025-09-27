import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { BarChart3, Users, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Interface d'Administration</h1>
          <p className="text-slate-400">Gérez votre plateforme WebCraft</p>
        </div>

        {/* Cartes de navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Dashboard Audit */}
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-amber-500" />
                <CardTitle className="text-white">Dashboard Audit</CardTitle>
              </div>
              <CardDescription>
                Gérez les demandes d'audit de sites web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  • Visualiser toutes les demandes
                  • Gérer les statuts
                  • Suivre les conversions
                </p>
                <Link href="/admin/dashboard">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Accéder au Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Gestion Clients (futur) */}
          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-white">Gestion Clients</CardTitle>
              </div>
              <CardDescription>
                Base de données clients (bientôt disponible)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  • Profils clients
                  • Historique des projets
                  • Communications
                </p>
                <Button disabled className="w-full">
                  Bientôt disponible
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rapports (futur) */}
          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-500" />
                <CardTitle className="text-white">Rapports</CardTitle>
              </div>
              <CardDescription>
                Analytics et rapports (bientôt disponible)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  • Statistiques détaillées
                  • Taux de conversion
                  • Performance commerciale
                </p>
                <Button disabled className="w-full">
                  Bientôt disponible
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Statistiques rapides */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Aperçu Rapide</CardTitle>
            <CardDescription>
              Statistiques de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500">-</p>
                <p className="text-sm text-slate-400">Demandes ce mois</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">-</p>
                <p className="text-sm text-slate-400">Audits planifiés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">-</p>
                <p className="text-sm text-slate-400">Devis envoyés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">-</p>
                <p className="text-sm text-slate-400">Taux conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
