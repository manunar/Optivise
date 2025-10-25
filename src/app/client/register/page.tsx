'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/components/ui/select';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { Eye, EyeOff, UserPlus, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';
import type { ClientRegistrationForm } from '@/shared/types/client';

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

export default function ClientRegisterPage() {
  const [formData, setFormData] = useState<ClientRegistrationForm>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    entreprise: '',
    telephone: '',
    secteur_activite: '',
    commune: '',
    accepte_conditions: false,
    accepte_newsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { signUp, error, loading, isAuthenticated } = useClientAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectTo = searchParams.get('redirect') || '/client/dashboard';
  const prefilledEmail = searchParams.get('email') || '';

  // Pré-remplir l'email si fourni
  useEffect(() => {
    if (prefilledEmail) {
      setFormData(prev => ({ ...prev, email: prefilledEmail }));
    }
  }, [prefilledEmail]);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !isFormValid()) return;

    setIsSubmitting(true);
    // Normaliser et valider l'email côté client
    const normalizedEmail = formData.email?.toString().trim().toLowerCase();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail || '');

    if (!emailIsValid) {
      setFormError('Adresse email invalide. Vérifiez le format (ex: jean.dupont@exemple.com).');
      setIsSubmitting(false);
      return;
    }

    setFormError(null);

    const payload = { ...formData, email: normalizedEmail };

    const result = await signUp(payload);
    
    if (result.success) {
      // Rediriger vers la page de vérification email ou dashboard
      router.push('/client/verify-email');
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ClientRegistrationForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // nettoyer l'erreur locale quand l'utilisateur modifie l'email
    if (field === 'email') setFormError(null);
  };

  const handleSelectChange = (field: keyof ClientRegistrationForm) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email && 
           formData.password && 
           formData.nom && 
           formData.prenom && 
           formData.entreprise && 
           formData.accepte_conditions;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
        <p className="text-slate-400">Rejoignez WebCraft et gérez vos projets</p>
      </motion.div>

      {/* Formulaire d'inscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-green-400" />
              Inscription Client
            </CardTitle>
            <CardDescription>
              Créez votre espace personnel en quelques minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
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
                    placeholder="Jean"
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
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Adresse email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="jean.dupont@entreprise.com"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          passwordStrength >= level
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Informations entreprise */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entreprise" className="text-slate-300">
                    Entreprise *
                  </Label>
                  <Input
                    id="entreprise"
                    value={formData.entreprise}
                    onChange={handleInputChange('entreprise')}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Mon Entreprise SARL"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-slate-300">
                    Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange('telephone')}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secteur" className="text-slate-300">
                    Secteur d'activité
                  </Label>
                  <Select onValueChange={handleSelectChange('secteur_activite')}>
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
                  <Input
                    id="commune"
                    value={formData.commune}
                    onChange={handleInputChange('commune')}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Paris"
                  />
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="conditions"
                    checked={formData.accepte_conditions}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, accepte_conditions: !!checked }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="conditions" className="text-slate-300 text-sm leading-relaxed">
                    J'accepte les{' '}
                    <Link href="/legal/conditions" className="text-blue-400 hover:text-blue-300">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="/legal/privacy" className="text-blue-400 hover:text-blue-300">
                      politique de confidentialité
                    </Link>
                    {' '}*
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.accepte_newsletter}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, accepte_newsletter: !!checked }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="newsletter" className="text-slate-300 text-sm leading-relaxed">
                    Je souhaite recevoir les actualités et offres de WebCraft par email
                  </Label>
                </div>
              </div>

              {/* Erreur */}
              {formError && (
                <Alert className="border-red-700 bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {formError}
                  </AlertDescription>
                </Alert>
              )}

              {error && !formError && (
                <Alert className="border-red-700 bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Bouton d'inscription */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>

            {/* Liens */}
            <div className="mt-6 text-center">
              <Link
                href="/client/login"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Retour */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
