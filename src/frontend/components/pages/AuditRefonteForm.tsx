"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Badge } from '@/frontend/components/ui/badge';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { SimpleCaptcha } from '@/frontend/components/ui/captcha';
import Navbar from '@/frontend/components/layout/Navbar';
import { 
  Search, 
  Mail, 
  User, 
  Building, 
  Phone, 
  AlertCircle, 
  Target, 
  CheckCircle,
  ArrowLeft,
  Globe,
  Zap
} from 'lucide-react';

// Composants Input et Textarea simples
const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input className={`px-3 py-2 rounded-md border ${className}`} {...props} />
);

const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) => (
  <textarea className={`px-4 py-3 rounded-md border ${className}`} {...props} />
);

// Types
interface AuditFormData {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  entreprise: string;
  url_site: string;
  problemes_rencontres: string[];
  objectifs_principaux: string[];
  commentaires_libres: string;
}

// Options prédéfinies
const PROBLEMES_OPTIONS = [
  "Site trop lent",
  "Design obsolète", 
  "Pas responsive",
  "Mauvais référencement",
  "Difficile à gérer",
  "Fonctionnalités manquantes",
  "Problèmes de sécurité",
  "Contenu obsolète"
];

const OBJECTIFS_OPTIONS = [
  "Moderniser le design",
  "Améliorer les performances",
  "Optimiser pour mobile",
  "Faciliter la gestion",
  "Ajouter des fonctionnalités",
  "Sécuriser le site",
  "Refonte complète"
];

interface AuditRefonteFormProps {
  onBack?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function AuditRefonteForm({ 
  onBack, 
  onSubmit, 
  isSubmitting: externalIsSubmitting, 
  error: externalError 
}: AuditRefonteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AuditFormData>({
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    entreprise: '',
    url_site: '',
    problemes_rencontres: [],
    objectifs_principaux: [],
    commentaires_libres: ''
  });

  const [messageAutoGenere, setMessageAutoGenere] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [erreurValidation, setErreurValidation] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Utiliser les props externes si fournies
  const finalIsSubmitting = externalIsSubmitting ?? isSubmitting;
  const finalError = externalError ?? erreurValidation;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  // Auto-génération du message
  useEffect(() => {
    generateMessage();
  }, [formData]);

  const generateMessage = () => {
    if (!formData.nom || !formData.prenom || !formData.entreprise) {
      setMessageAutoGenere('');
      return;
    }

    let message = `Bonjour,\n\nJe suis ${formData.prenom} ${formData.nom} de l'entreprise ${formData.entreprise}.`;
    
    if (formData.url_site) {
      message += `\n\nJ'aimerais obtenir un audit gratuit pour notre site web : ${formData.url_site}`;
    } else {
      message += `\n\nJ'aimerais obtenir un audit gratuit pour notre site web.`;
    }

    if (formData.problemes_rencontres.length > 0) {
      message += `\n\nNous rencontrons actuellement les problèmes suivants :\n${formData.problemes_rencontres.map(p => `• ${p}`).join('\n')}`;
    }

    if (formData.objectifs_principaux.length > 0) {
      message += `\n\nNos objectifs principaux sont :\n${formData.objectifs_principaux.map(o => `• ${o}`).join('\n')}`;
    }

    if (formData.commentaires_libres.trim()) {
      message += `\n\nInformations complémentaires :\n${formData.commentaires_libres}`;
    }

    message += '\n\nMerci pour votre retour !';
    setMessageAutoGenere(message);
  };

  const handleProblemeChange = (probleme: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      problemes_rencontres: checked 
        ? [...prev.problemes_rencontres, probleme]
        : prev.problemes_rencontres.filter(p => p !== probleme)
    }));
  };

  const handleObjectifChange = (objectif: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      objectifs_principaux: checked 
        ? [...prev.objectifs_principaux, objectif]
        : prev.objectifs_principaux.filter(o => o !== objectif)
    }));
  };

  const validerFormulaire = () => {
    if (!formData.email || !formData.nom || !formData.prenom || !formData.entreprise) {
      setErreurValidation('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErreurValidation('Format d\'email invalide');
      return false;
    }
    
    setErreurValidation('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validerFormulaire()) {
      return;
    }

    // Vérifier le CAPTCHA
    if (!captchaToken) {
      setErreurValidation('Veuillez compléter la vérification anti-spam');
      return;
    }

    const submissionData = {
      ...formData,
      message_auto_genere: messageAutoGenere,
      captcha_token: captchaToken
    };

    // Si onSubmit est fourni (mode avec authentification), l'utiliser
    if (onSubmit) {
      try {
        await onSubmit(submissionData);
      } catch (error) {
        console.error('Erreur:', error);
        setErreurValidation('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
      }
      return;
    }

    // Sinon, mode classique sans authentification
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/audit-refonte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErreurValidation('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-green-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-white text-xl">Demande envoyée !</CardTitle>
              <CardDescription className="text-slate-300">
                Votre demande d'audit a été transmise avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-400 text-sm">
                Nous vous contacterons dans les plus brefs délais pour planifier votre audit gratuit.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-3 rounded-xl">
                <Search className="w-8 h-8 text-black" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Audit Gratuit de Votre Site Web
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Obtenez un diagnostic complet et des recommandations personnalisées 
              pour améliorer votre présence en ligne
            </p>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Informations sur votre projet
                </CardTitle>
                <CardDescription>
                  Parlez-nous de votre site actuel et de vos objectifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de contact */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Prénom *
                      </label>
                      <Input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Nom *
                      </label>
                      <Input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Téléphone
                      </label>
                      <Input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Building className="w-4 h-4 inline mr-1" />
                      Entreprise *
                    </label>
                    <Input
                      type="text"
                      value={formData.entreprise}
                      onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="Nom de votre entreprise"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      URL de votre site web
                    </label>
                    <Input
                      type="url"
                      value={formData.url_site}
                      onChange={(e) => setFormData(prev => ({ ...prev, url_site: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="https://votre-site.com"
                    />
                  </div>

                  {/* Problèmes rencontrés */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Quels problèmes rencontrez-vous ? (optionnel)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {PROBLEMES_OPTIONS.map((probleme) => (
                        <div key={probleme} className="flex items-center space-x-2">
                          <Checkbox
                            id={`probleme-${probleme}`}
                            checked={formData.problemes_rencontres.includes(probleme)}
                            onCheckedChange={(checked) => handleProblemeChange(probleme, checked as boolean)}
                          />
                          <label 
                            htmlFor={`probleme-${probleme}`}
                            className="text-slate-300 text-sm cursor-pointer"
                          >
                            {probleme}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectifs principaux */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      <Target className="w-4 h-4 inline mr-1" />
                      Quels sont vos objectifs ? (optionnel)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {OBJECTIFS_OPTIONS.map((objectif) => (
                        <div key={objectif} className="flex items-center space-x-2">
                          <Checkbox
                            id={`objectif-${objectif}`}
                            checked={formData.objectifs_principaux.includes(objectif)}
                            onCheckedChange={(checked) => handleObjectifChange(objectif, checked as boolean)}
                          />
                          <label 
                            htmlFor={`objectif-${objectif}`}
                            className="text-slate-300 text-sm cursor-pointer"
                          >
                            {objectif}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Commentaires libres */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Informations complémentaires (optionnel)
                    </label>
                    <Textarea
                      value={formData.commentaires_libres}
                      onChange={(e) => setFormData(prev => ({ ...prev, commentaires_libres: e.target.value }))}
                      className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[150px] resize-y"
                      placeholder="Décrivez votre contexte, vos besoins spécifiques, votre budget approximatif..."
                      rows={6}
                    />
                  </div>

                  {/* Aperçu du message */}
                  {messageAutoGenere && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Aperçu de votre demande
                      </label>
                      <div className="bg-slate-700 border border-slate-600 rounded-md p-4">
                        <div className="text-slate-300 text-sm whitespace-pre-line">
                          {messageAutoGenere}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CAPTCHA */}
                  <div>
                    <SimpleCaptcha onSuccess={setCaptchaToken} />
                  </div>

                  {/* Erreur de validation */}
                  {finalError && (
                    <div className="bg-red-900/20 border border-red-700 rounded-md p-3">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-red-300 text-sm">{finalError}</span>
                      </div>
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={finalIsSubmitting || !captchaToken}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-medium"
                    >
                      {finalIsSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Demander mon audit gratuit
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
