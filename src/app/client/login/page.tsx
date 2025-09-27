'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';
import type { ClientLoginForm } from '@/shared/types/client';

export default function ClientLoginPage() {
  const [formData, setFormData] = useState<ClientLoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, error, loading, isAuthenticated } = useClientAuthContext();
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const success = await signIn(formData);
    
    if (success) {
      router.push(redirectTo);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ClientLoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.email && formData.password;

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
        <h1 className="text-3xl font-bold text-white mb-2">Espace Client</h1>
        <p className="text-slate-400">Connectez-vous pour accéder à vos projets</p>
      </motion.div>

      {/* Formulaire de connexion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Connexion Client
            </CardTitle>
            <CardDescription>
              Accédez à votre espace personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe
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
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <Alert className="border-red-700 bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            {/* Liens */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link
                  href="/client/register"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Pas encore de compte ? Créer un compte
                </Link>
              </div>
              
              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-slate-400 hover:text-slate-300 text-sm"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
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
