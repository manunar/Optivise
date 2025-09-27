'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/components/ui/select';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';
import type { ClientProfile } from '@/shared/types/client';

const SECTEURS_ACTIVITE = [
  'E-commerce',
  'Services',
  'Industrie',
  'Santé',
  'Éducation',
  'Finance',
  'Immobilier',
  'Restauration',
  'Technologie',
  'Autre'
];

export default function ClientProfilePage() {
  const [formData, setFormData] = useState<ClientProfile>({
    nom: '',
    prenom: '',
    telephone: '',
    entreprise: '',
    secteur_activite: '',
    commune: '',
    preferences_json: {
      notifications_email: true,
      notifications_sms: false,
      langue: 'fr',
      theme: 'light'
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { client, loading: authLoading, updateProfile, isAuthenticated } = useClientAuthContext();
  const router = useRouter();

  // Rediriger si pas connecté
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Charger les données du profil
  useEffect(() => {
    if (client) {
      setFormData({
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone || '',
        entreprise: client.entreprise,
        secteur_activite: client.secteur_activite || '',
        commune: client.commune || '',
        preferences_json: {
          notifications_email: client.preferences_json?.notifications_email ?? true,
          notifications_sms: client.preferences_json?.notifications_sms ?? false,
          langue: client.preferences_json?.langue ?? 'fr',
          theme: client.preferences_json?.theme ?? 'light'
        }
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const success = await updateProfile(formData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ClientProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof ClientProfile) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences_json: {
        ...prev.preferences_json,
        [field]: checked
      }
    }));
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            <p className="text-slate-400">Gérez vos informations personnelles</p>
          </div>
          
          <Link
            href="/client/dashboard"
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Message de feedback */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className={`${
              message.type === 'success' 
                ? 'border-green-700 bg-green-900/20' 
                : 'border-red-700 bg-red-900/20'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription className={
                message.type === 'success' ? 'text-green-300' : 'text-red-300'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-slate-300">
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange('prenom')}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-slate-300">
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={handleInputChange('nom')}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Adresse email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={client.email}
                    className="bg-slate-700 border-slate-600 text-slate-400"
                    disabled
                  />
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
                </div>
                <p className="text-slate-500 text-xs">
                  L'email ne peut pas être modifié. Contactez le support si nécessaire.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-slate-300">
                  Téléphone
                </Label>
                <div className="relative">
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange('telephone')}
                    className="bg-slate-700 border-slate-600 text-white pl-10"
                    placeholder="06 12 34 56 78"
                  />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations entreprise */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Informations entreprise
              </CardTitle>
              <CardDescription>
                Détails sur votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="entreprise" className="text-slate-300">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange('entreprise')}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secteur" className="text-slate-300">
                    Secteur d'activité
                  </Label>
                  <Select 
                    value={formData.secteur_activite} 
                    onValueChange={handleSelectChange('secteur_activite')}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTEURS_ACTIVITE.map((secteur) => (
                        <SelectItem key={secteur} value={secteur}>
                          {secteur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commune" className="text-slate-300">
                    Ville
                  </Label>
                  <div className="relative">
                    <Input
                      id="commune"
                      value={formData.commune}
                      onChange={handleInputChange('commune')}
                      className="bg-slate-700 border-slate-600 text-white pl-10"
                      placeholder="Paris"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préférences */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Préférences</CardTitle>
              <CardDescription>
                Personnalisez votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications_email"
                  checked={formData.preferences_json.notifications_email}
                  onCheckedChange={handlePreferenceChange('notifications_email')}
                />
                <Label htmlFor="notifications_email" className="text-slate-300">
                  Recevoir les notifications par email
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications_sms"
                  checked={formData.preferences_json.notifications_sms}
                  onCheckedChange={handlePreferenceChange('notifications_sms')}
                />
                <Label htmlFor="notifications_sms" className="text-slate-300">
                  Recevoir les notifications par SMS
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
