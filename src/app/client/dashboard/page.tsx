'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  FileText, 
  Calendar, 
  Settings,
  LogOut,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';

interface Demande {
  id: string;
  type: 'devis' | 'audit';
  created_at: string;
  statut: string;
  prix_estime_ht?: number;
  url_site_actuel?: string;
  entreprise: string;
}

const statusConfig = {
  nouveau: { label: 'Nouveau', color: 'bg-blue-500', icon: '🆕' },
  contacte: { label: 'Contacté', color: 'bg-yellow-500', icon: '📞' },
  audit_planifie: { label: 'Audit planifié', color: 'bg-purple-500', icon: '📅' },
  devis_envoye: { label: 'Devis envoyé', color: 'bg-green-500', icon: '📄' },
  termine: { label: 'Terminé', color: 'bg-gray-500', icon: '✅' }
};

export default function ClientDashboard() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { client, loading: authLoading, signOut, isAuthenticated } = useClientAuthContext();
  const router = useRouter();

  // Rediriger si pas connecté
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Charger les demandes du client
  useEffect(() => {
    if (client) {
      loadDemandes();
    }
  }, [client]);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/client/demandes');
      
      if (response.ok) {
        const data = await response.json();
        setDemandes(data.demandes || []);
      } else {
        setError('Erreur lors du chargement des demandes');
      }
    } catch (error) {
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (authLoading || !client) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Espace Client</h1>
            <p className="text-slate-400">
              Bienvenue, {client.prenom} {client.nom}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
              onClick={() => router.push('/client/profile')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Profil
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Alerte email non vérifié */}
        {!client.email_confirme_supabase && (
          <Alert className="border-yellow-700 bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Votre email n'est pas encore vérifié.{' '}
              <Link href="/client/verify-email" className="underline hover:text-yellow-200">
                Vérifier maintenant
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Demandes totales</p>
                  <p className="text-2xl font-bold text-white">
                    {client.nb_demandes_devis + client.nb_demandes_audit}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Demandes de devis</p>
                  <p className="text-2xl font-bold text-white">{client.nb_demandes_devis}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Demandes d'audit</p>
                  <p className="text-2xl font-bold text-white">{client.nb_demandes_audit}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Statut compte</p>
                  <p className="text-sm font-medium text-green-400">
                    {client.email_confirme_supabase ? 'Vérifié' : 'En attente'}
                  </p>
                </div>
                {client.email_confirme_supabase ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations du profil */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations du profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Entreprise</p>
                    <p className="text-white">{client.entreprise}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {client.telephone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Téléphone</p>
                      <p className="text-white">{client.telephone}</p>
                    </div>
                  </div>
                )}
                {client.secteur_activite && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Secteur</p>
                      <p className="text-white">{client.secteur_activite}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mes demandes */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Mes demandes
            </CardTitle>
            <CardDescription>
              Suivez l'état d'avancement de vos projets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-slate-400">Chargement des demandes...</div>
              </div>
            ) : error ? (
              <Alert className="border-red-700 bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            ) : demandes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Aucune demande pour le moment</p>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/configurateur">Demander un devis</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/audit-refonte">Demander un audit</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {demandes.map((demande) => (
                  <motion.div
                    key={demande.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={`${statusConfig[demande.statut as keyof typeof statusConfig]?.color || 'bg-gray-500'} text-white`}>
                            {statusConfig[demande.statut as keyof typeof statusConfig]?.icon} {statusConfig[demande.statut as keyof typeof statusConfig]?.label || demande.statut}
                          </Badge>
                          <span className="text-slate-400 text-sm">
                            {demande.type === 'devis' ? 'Demande de devis' : 'Demande d\'audit'}
                          </span>
                        </div>
                        <p className="text-white font-medium">
                          {demande.url_site_actuel || demande.entreprise}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Créée le {formatDate(demande.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        {demande.prix_estime_ht && (
                          <p className="text-green-400 font-medium">
                            {formatPrice(demande.prix_estime_ht)}
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => router.push(`/client/demandes/${demande.id}`)}
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4">
                <Link href="/configurateur" className="flex flex-col items-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span>Nouveau devis</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/audit-refonte" className="flex flex-col items-center space-y-2">
                  <Eye className="w-6 h-6" />
                  <span>Audit de site</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/client/profile" className="flex flex-col items-center space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Mon profil</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
