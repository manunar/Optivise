"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelectedOptions } from "@/hooks/useOptions";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Building,
  Phone,
  MessageSquare,
  Calculator,
  Send,
  Sparkles,
  Clock,
  Euro
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";

interface OptionSelectionnee {
  id: string;
  nom: string;
  description: string;
  description_courte?: string;
  prix_ht: number;
  categorie: string;
  type_option: string;
  code: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  message: string;
}

const DemandeDevisPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mémoriser optionIds pour éviter les re-renders en boucle
  const optionIds = useMemo(() => {
    return searchParams.get('options')?.split(',') || [];
  }, [searchParams]);
  
  const sessionId = searchParams.get('session');
  
  // Utiliser le hook personnalisé pour les options
  const { selectedOptions: options, loading, error: optionsError, totalPrice } = useSelectedOptions(optionIds);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    message: ''
  });

  // Vérifier les erreurs et les options
  useEffect(() => {
    if (optionsError) {
      setError(optionsError);
    } else if (!loading && optionIds.length > 0 && options.length === 0) {
      setError("Aucune option trouvée. Veuillez retourner aux recommandations.");
    } else if (optionIds.length === 0) {
      setError("Aucune option sélectionnée. Veuillez retourner aux recommandations.");
    } else {
      setError(null);
    }
  }, [optionsError, loading, optionIds, options]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return totalPrice; // Utiliser le total calculé par le hook
  };

  const isFormValid = () => {
    return formData.nom && formData.prenom && formData.email && formData.entreprise;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setSubmitting(true);
    
    try {
      // Calculer les prix
      const prixHT = calculateTotal();
      const prixTTC = prixHT * 1.2; // TVA 20%

      // Préparer les données pour l'API demandes
      const demandeData = {
        // Configuration (obligatoire)
        configuration_json: {
          session_id: sessionId,
          options_selectionnees: options.map(opt => ({
            id: opt.id,
            nom: opt.nom,
            prix: opt.prix_ht
          })),
          total_estime: prixHT,
          source: 'configurateur_assisté'
        },
        prix_estime_ht: prixHT,
        prix_estime_ttc: prixTTC,
        mode_creation: 'assiste', // Corrigé pour correspondre au schéma

        // Contact (obligatoire)
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || '',
        entreprise: formData.entreprise,
        commune: '', // Optionnel

        // Contexte business (optionnel) - Récupérés depuis la session du questionnaire
        secteur_activite: undefined, // Sera récupéré depuis la session
        objectif_principal: undefined,
        situation_actuelle: '',
        budget_max: undefined, // Sera récupéré depuis la session
        delai_souhaite: undefined, // Sera récupéré depuis la session

        // Informations complémentaires (optionnel)
        contenus_disponibles: '',
        commentaires_libres: formData.message || '', // Corrigé

        // RGPD (obligatoire)
        consentement_commercial: true, // Obligatoire pour recevoir un devis
        consentement_newsletter: false
      };

      const response = await fetch('/api/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demandeData),
      });

      const result = await response.json();

      if (result.success) {
        // Rediriger vers une page de confirmation
        router.push(`/configurateur/confirmation?demande=${result.data.id}`);
      } else {
        setError(result.error || "Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setError("Erreur lors de l'envoi de la demande");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre devis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-4">Erreur</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/configurateur/recommandations">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">
              Retour aux recommandations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Link href={`/configurateur/recommandations?session=${sessionId}`} className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux recommandations
            </Link>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-400/30 px-4 py-2">
              Étape 3/3 - Demande de Devis
            </Badge>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-amber-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Demande de Devis
              </span>
            </h1>
          </div>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Finalisez votre demande pour recevoir un devis personnalisé basé sur vos options sélectionnées.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <User className="w-6 h-6 mr-3 text-amber-400" />
                    Vos informations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prenom" className="text-gray-300">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nom" className="text-gray-300">Nom *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone" className="text-gray-300">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    {/* Informations entreprise */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entreprise" className="text-gray-300">Entreprise *</Label>
                        <Input
                          id="entreprise"
                          value={formData.entreprise}
                          onChange={(e) => handleInputChange('entreprise', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-gray-300">Message complémentaire</Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 mt-1 min-h-[100px]"
                        placeholder="Décrivez votre projet, vos besoins spécifiques..."
                      />
                    </div>

                    {/* Bouton de soumission */}
                    <Button
                      type="submit"
                      disabled={!isFormValid() || submitting}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold py-3 text-lg"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer ma demande de devis
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Résumé des options */}
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
                    Options sélectionnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="text-white font-medium text-sm">{option.nom}</p>
                        <p className="text-gray-400 text-xs">{option.categorie}</p>
                      </div>
                      <div className="text-amber-400 font-bold">
                        {option.prix_ht.toLocaleString()}€
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-white">Total estimé</span>
                      <span className="text-amber-400">{total.toLocaleString()}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations */}
              <Card className="border-gray-700 bg-gray-800/30">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Réponse rapide</p>
                        <p>Nous vous répondrons sous 24h avec un devis détaillé</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Euro className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Devis gratuit</p>
                        <p>Aucun engagement, devis personnalisé gratuit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Accompagnement</p>
                        <p>Suivi personnalisé tout au long du projet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandeDevisPage;
