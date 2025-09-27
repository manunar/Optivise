'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Alert, AlertDescription } from '@/frontend/components/ui/alert';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type VerificationStatus = 'loading' | 'success' | 'error' | 'already_verified';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Vérifier d'abord les paramètres de succès/erreur directs
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const next = searchParams.get('next') || '/client/dashboard';

        if (success === 'true') {
          setStatus('success');
          setMessage('Votre email a été vérifié avec succès !');
          setTimeout(() => {
            router.push(next);
          }, 3000);
          return;
        }

        if (error) {
          setStatus('error');
          switch (error) {
            case 'invalid_link':
              setMessage('Lien de vérification invalide ou expiré.');
              break;
            case 'verification_failed':
              setMessage('Erreur lors de la vérification de l\'email.');
              break;
            case 'user_not_found':
              setMessage('Utilisateur non trouvé.');
              break;
            case 'server_error':
              setMessage('Erreur interne du serveur.');
              break;
            default:
              setMessage('Erreur lors de la vérification.');
          }
          return;
        }

        // Récupérer les paramètres de l'URL pour vérification manuelle
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || type !== 'email') {
          setStatus('error');
          setMessage('Lien de vérification invalide ou expiré.');
          return;
        }

        // Appeler l'API pour vérifier l'email
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token_hash,
            type,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Votre email a été vérifié avec succès !');
          
          // Rediriger après 3 secondes
          setTimeout(() => {
            router.push(next);
          }, 3000);
        } else if (data.error === 'already_verified') {
          setStatus('already_verified');
          setMessage('Votre email est déjà vérifié.');
          
          // Rediriger après 2 secondes
          setTimeout(() => {
            router.push(next);
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la vérification de l\'email.');
        }
      } catch (error) {
        console.error('Erreur callback auth:', error);
        setStatus('error');
        setMessage('Erreur lors de la vérification. Veuillez réessayer.');
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'already_verified':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-400" />;
      default:
        return <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
      case 'already_verified':
        return 'border-green-700 bg-green-900/20';
      case 'error':
        return 'border-red-700 bg-red-900/20';
      default:
        return 'border-blue-700 bg-blue-900/20';
    }
  };

  const getMessageColor = () => {
    switch (status) {
      case 'success':
      case 'already_verified':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Animation d'icône */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
          {getStatusIcon()}
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
            <CardTitle className="text-white">
              {status === 'loading' && 'Vérification en cours...'}
              {status === 'success' && 'Email vérifié !'}
              {status === 'already_verified' && 'Email déjà vérifié'}
              {status === 'error' && 'Erreur de vérification'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Nous vérifions votre email, veuillez patienter...'}
              {status === 'success' && 'Félicitations ! Votre compte est maintenant activé.'}
              {status === 'already_verified' && 'Votre compte est déjà activé.'}
              {status === 'error' && 'Une erreur s\'est produite lors de la vérification.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message de statut */}
            {message && (
              <Alert className={getStatusColor()}>
                <AlertDescription className={getMessageColor()}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions selon le statut */}
            {status === 'success' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300 text-sm">
                  Redirection automatique vers votre espace client dans 3 secondes...
                </p>
                <Button
                  onClick={() => router.push('/client/dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Accéder à mon espace
                </Button>
              </div>
            )}

            {status === 'already_verified' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300 text-sm">
                  Redirection automatique dans 2 secondes...
                </p>
                <Button
                  onClick={() => router.push('/client/dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Accéder à mon espace
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/client/verify-email')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Renvoyer l'email de vérification
                  </Button>
                  <Button
                    onClick={() => router.push('/client/login')}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    Retour à la connexion
                  </Button>
                </div>
                <p className="text-slate-400 text-xs">
                  Problème persistant ? Contactez-nous à{' '}
                  <a href="mailto:support@optivise.fr" className="text-blue-400 hover:text-blue-300">
                    support@optivise.fr
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Lien retour */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
