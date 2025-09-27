'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/frontend/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/frontend/components/ui/table';
import { Search, Eye, Phone, TrendingUp, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DevisRequest {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  entreprise?: string;
  telephone?: string;
  budget?: string;
  prix?: number;
  statut: 'nouveau' | 'en_cours' | 'termine' | 'devis_envoye' | 'accepte' | 'refuse';
  configuration?: any;
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  nouveau: { label: 'Nouveau', color: 'bg-red-500', icon: '🆕' },
  en_cours: { label: 'En cours', color: 'bg-yellow-500', icon: '⏳' },
  devis_envoye: { label: 'Devis envoyé', color: 'bg-blue-500', icon: '📄' },
  accepte: { label: 'Accepté', color: 'bg-green-500', icon: '✅' },
  refuse: { label: 'Refusé', color: 'bg-gray-500', icon: '❌' },
  termine: { label: 'Terminé', color: 'bg-purple-500', icon: '🎉' }
};

export default function AdminDevisDashboard() {
  const [requests, setRequests] = useState<DevisRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DevisRequest | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<DevisRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    devis_envoye: 0,
    accepte: 0,
    refuse: 0,
    termine: 0
  });

  useEffect(() => {
    fetchDevisRequests();
  }, []);

  const fetchDevisRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/devis');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
        calculateStats(data.requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes de devis:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (request: DevisRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const calculateStats = (requestsData: DevisRequest[]) => {
    const stats = {
      total: requestsData.length,
      nouveau: requestsData.filter(r => r.statut === 'nouveau').length,
      en_cours: requestsData.filter(r => r.statut === 'en_cours').length,
      devis_envoye: requestsData.filter(r => r.statut === 'devis_envoye').length,
      accepte: requestsData.filter(r => r.statut === 'accepte').length,
      refuse: requestsData.filter(r => r.statut === 'refuse').length,
      termine: requestsData.filter(r => r.statut === 'termine').length
    };
    setStats(stats);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/devis/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      });
      
      if (response.ok) {
        await fetchDevisRequests(); // Recharger les données
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const openDeleteConfirm = (request: DevisRequest) => {
    setRequestToDelete(request);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setRequestToDelete(null);
    setDeleteConfirmOpen(false);
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/devis/${requestToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        await fetchDevisRequests(); // Recharger les données
        closeDeleteConfirm();
      } else {
        const error = await response.json();
        console.error('Erreur lors de la suppression:', error.error);
        alert('Erreur lors de la suppression: ' + error.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || request.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux audits
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Devis</h1>
              <p className="text-slate-400">Gestion des demandes de devis</p>
            </div>
          </div>
          <Button onClick={fetchDevisRequests} className="bg-amber-600 hover:bg-amber-700">
            Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(statusConfig).map(([status, config]) => (
            <Card key={status} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <div>
                    <p className="text-sm text-slate-400">{config.label}</p>
                    <p className="text-2xl font-bold text-white">{stats[status as keyof typeof stats]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtres */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des demandes */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Demandes de Devis ({filteredRequests.length})</CardTitle>
            <CardDescription>Liste de toutes les demandes de devis reçues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Client</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Budget</TableHead>
                    <TableHead className="text-slate-300">Prix</TableHead>
                    <TableHead className="text-slate-300">Statut</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="border-slate-700">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{request.nom}</p>
                          {request.entreprise && (
                            <p className="text-sm text-slate-400">{request.entreprise}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-slate-300">{request.email}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300">
                          {request.budget || 'Non renseigné'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300 font-medium">
                          {formatPrice(request.prix)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={request.statut} 
                          onValueChange={(value) => updateStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                            <Badge className={`${statusConfig[request.statut].color} text-white`}>
                              {statusConfig[request.statut].icon} {statusConfig[request.statut].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <SelectItem key={status} value={status}>
                                {config.icon} {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300 text-sm">
                          {formatDate(request.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => openDetails(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500"
                            onClick={() => openDeleteConfirm(request)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Panel */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="bg-slate-900 border-slate-700 text-white overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails de la demande de devis</SheetTitle>
            <SheetDescription className="text-slate-400">
              Informations complètes sur la demande de devis.
            </SheetDescription>
          </SheetHeader>

          {selectedRequest && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Client</p>
                <p className="font-semibold">{selectedRequest.nom} {selectedRequest.prenom || ''}</p>
                {selectedRequest.entreprise && (
                  <p className="text-slate-300 text-sm">{selectedRequest.entreprise}</p>
                )}
                <p className="text-slate-300 text-sm">{selectedRequest.email}</p>
                {selectedRequest.telephone && (
                  <p className="text-slate-300 text-sm">{selectedRequest.telephone}</p>
                )}
              </div>

              {selectedRequest.budget && (
                <div>
                  <p className="text-slate-400 text-sm">Budget client</p>
                  <p className="text-slate-200">{selectedRequest.budget}</p>
                </div>
              )}

              {selectedRequest.prix && (
                <div>
                  <p className="text-slate-400 text-sm">Prix proposé</p>
                  <p className="text-slate-200 font-semibold text-lg">{formatPrice(selectedRequest.prix)}</p>
                </div>
              )}

              {selectedRequest.configuration && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Configuration</p>
                  <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 text-xs">
                    {JSON.stringify(selectedRequest.configuration, null, 2)}
                  </pre>
                </div>
              )}

              {selectedRequest.notes_internes && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Notes internes</p>
                  <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded p-3 text-slate-100">
                    {selectedRequest.notes_internes}
                  </pre>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal de confirmation de suppression */}
      <Sheet open={deleteConfirmOpen} onOpenChange={closeDeleteConfirm}>
        <SheetContent className="bg-slate-900 border-slate-700 text-white">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </SheetTitle>
            <SheetDescription className="text-slate-400">
              Cette action est irréversible. La demande de devis sera définitivement supprimée.
            </SheetDescription>
          </SheetHeader>

          {requestToDelete && (
            <div className="mt-6 space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Demande à supprimer :</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-slate-400">Client :</span> {requestToDelete.nom}</p>
                  <p><span className="text-slate-400">Email :</span> {requestToDelete.email}</p>
                  {requestToDelete.entreprise && (
                    <p><span className="text-slate-400">Entreprise :</span> {requestToDelete.entreprise}</p>
                  )}
                  {requestToDelete.prix && (
                    <p><span className="text-slate-400">Prix :</span> {formatPrice(requestToDelete.prix)}</p>
                  )}
                  <p><span className="text-slate-400">Date :</span> {formatDate(requestToDelete.created_at)}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={closeDeleteConfirm}
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer définitivement
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
