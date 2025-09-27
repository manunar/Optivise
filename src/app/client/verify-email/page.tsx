'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { client, loading, isAuthenticated } = useClientAuthContext();
  const router = useRouter();

  // Rediriger si pas connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [loading, isAuthenticated, router]);

  // Rediriger si email déjà vérifié
  useEffect(() => {
    if (client?.email_confirme_supabase) {
      router.push('/client/dashboard');
    }
  }, [client, router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/client/resend-verification', {
        method: 'POST',
      });

      if (response.ok) {
        setResendMessage('Email de vérification renvoyé avec succès !');
      } else {
        setResendMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      setResendMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Animation d'email */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-12 h-12 text-blue-400" />
        </div>
      </motion.div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Vérifiez votre email
            </CardTitle>
            <CardDescription>
              Nous avons envoyé un lien de vérification à votre adresse email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email de l'utilisateur */}
            {client?.email && (
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-slate-300 text-sm text-center">
                  Email envoyé à :
                </p>
                <p className="text-white font-medium text-center mt-1">
                  {client.email}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-3 text-slate-300 text-sm">
              <p>
                <strong className="text-white">1.</strong> Consultez votre boîte de réception
              </p>
              <p>
                <strong className="text-white">2.</strong> Cliquez sur le lien de vérification
              </p>
              <p>
                <strong className="text-white">3.</strong> Revenez ici pour accéder à votre espace
              </p>
            </div>

            {/* Message de renvoi */}
            {resendMessage && (
              <Alert className={`${
                resendMessage.includes('succès') 
                  ? 'border-green-700 bg-green-900/20' 
                  : 'border-red-700 bg-red-900/20'
              }`}>
                <AlertDescription className={
                  resendMessage.includes('succès') ? 'text-green-300' : 'text-red-300'
                }>
                  {resendMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Bouton de renvoi */}
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renvoyer l'email
                </>
              )}
            </Button>

            {/* Aide */}
            <div className="text-center space-y-2">
              <p className="text-slate-400 text-xs">
                Vous ne trouvez pas l'email ? Vérifiez vos spams.
              </p>
              <p className="text-slate-400 text-xs">
                Problème ? Contactez-nous à{' '}
                <a href="mailto:support@webcraft.fr" className="text-blue-400 hover:text-blue-300">
                  support@webcraft.fr
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col items-center space-y-4"
      >
        <Button
          onClick={() => router.push('/client/dashboard')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Accéder à mon espace
        </Button>
        
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
