'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/frontend/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/frontend/components/ui/table';
import { Search, Filter, Eye, Phone, Calendar, FileText, TrendingUp, Trash2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface AuditRequest {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  entreprise?: string;
  telephone?: string;
  url_site_actuel?: string;
  url_site?: string; // Ajouté par l'API
  problemes_identifies?: string[];
  objectifs_souhaites?: string[];
  taille_site_estimee?: string;
  budget_envisage?: string;
  delai_souhaite?: string;
  message_auto_genere?: string;
  commentaires_libres?: string;
  statut: 'nouveau' | 'contacte' | 'audit_planifie' | 'devis_envoye' | 'termine';
  priorite?: number;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
  date_audit_prevue?: string;
  rapport_audit_url?: string;
  recommandations?: string;
  devis_genere_id?: string;
}

const statusConfig = {
  nouveau: { label: 'Nouveau', color: 'bg-red-500', icon: '🆕' },
  contacte: { label: 'Contacté', color: 'bg-yellow-500', icon: '📞' },
  audit_planifie: { label: 'Audit planifié', color: 'bg-blue-500', icon: '📅' },
  devis_envoye: { label: 'Devis envoyé', color: 'bg-green-500', icon: '📄' },
  termine: { label: 'Terminé', color: 'bg-gray-500', icon: '✅' }
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AuditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AuditRequest | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<AuditRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    contacte: 0,
    audit_planifie: 0,
    devis_envoye: 0,
    termine: 0
  });

  useEffect(() => {
    fetchAuditRequests();
  }, []);

  const fetchAuditRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/audit-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
        calculateStats(data.requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (request: AuditRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const calculateStats = (requestsData: AuditRequest[]) => {
    const stats = {
      total: requestsData.length,
      nouveau: requestsData.filter(r => r.statut === 'nouveau').length,
      contacte: requestsData.filter(r => r.statut === 'contacte').length,
      audit_planifie: requestsData.filter(r => r.statut === 'audit_planifie').length,
      devis_envoye: requestsData.filter(r => r.statut === 'devis_envoye').length,
      termine: requestsData.filter(r => r.statut === 'termine').length
    };
    setStats(stats);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/audit-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      });
      
      if (response.ok) {
        await fetchAuditRequests(); // Recharger les données
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const openDeleteConfirm = (request: AuditRequest) => {
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
      const response = await fetch(`/api/admin/audit-requests/${requestToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        await fetchAuditRequests(); // Recharger les données
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
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Audit</h1>
            <p className="text-slate-400">Gestion des demandes d'audit de sites web</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/devis">
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600/10">
                Dashboard Devis
              </Button>
            </Link>
            <Button onClick={fetchAuditRequests} className="bg-amber-600 hover:bg-amber-700">
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <CardTitle className="text-white">Demandes d'Audit ({filteredRequests.length})</CardTitle>
            <CardDescription>Liste de toutes les demandes d'audit reçues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Client</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Site</TableHead>
                    <TableHead className="text-slate-300">Budget</TableHead>
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
                        {request.url_site ? (
                          <a 
                            href={request.url_site} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {request.url_site}
                          </a>
                        ) : (
                          <span className="text-slate-500">Non renseigné</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300">
                          {request.budget_envisage || 'Non renseigné'}
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
            <SheetTitle>Détails de la demande</SheetTitle>
            <SheetDescription className="text-slate-400">
              Informations complètes et message envoyé par le client.
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

              {selectedRequest.url_site && (
                <div>
                  <p className="text-slate-400 text-sm">Site actuel</p>
                  <a href={selectedRequest.url_site} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {selectedRequest.url_site}
                  </a>
                </div>
              )}

              {selectedRequest.problemes_identifies && selectedRequest.problemes_identifies.length > 0 && (
                <div>
                  <p className="text-slate-400 text-sm">Problèmes identifiés</p>
                  <ul className="list-disc ml-5 text-slate-200">
                    {selectedRequest.problemes_identifies.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRequest.objectifs_souhaites && selectedRequest.objectifs_souhaites.length > 0 && (
                <div>
                  <p className="text-slate-400 text-sm">Objectifs souhaités</p>
                  <ul className="list-disc ml-5 text-slate-200">
                    {selectedRequest.objectifs_souhaites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRequest.taille_site_estimee && (
                <div>
                  <p className="text-slate-400 text-sm">Taille du site estimée</p>
                  <p className="text-slate-200">{selectedRequest.taille_site_estimee}</p>
                </div>
              )}

              {selectedRequest.budget_envisage && (
                <div>
                  <p className="text-slate-400 text-sm">Budget envisagé</p>
                  <p className="text-slate-200">{selectedRequest.budget_envisage}</p>
                </div>
              )}

              {selectedRequest.delai_souhaite && (
                <div>
                  <p className="text-slate-400 text-sm">Délai souhaité</p>
                  <p className="text-slate-200">{selectedRequest.delai_souhaite}</p>
                </div>
              )}

              {selectedRequest.message_auto_genere && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Message généré</p>
                  <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded p-3 text-slate-100">
                    {selectedRequest.message_auto_genere}
                  </pre>
                </div>
              )}

              {selectedRequest.commentaires_libres && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Commentaires libres</p>
                  <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded p-3 text-slate-100">
                    {selectedRequest.commentaires_libres}
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
              Cette action est irréversible. La demande sera définitivement supprimée.
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
