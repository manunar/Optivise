"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { 
  CheckCircle,
  Mail,
  Clock,
  ArrowRight,
  Home,
  MessageSquare,
  Calendar
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const demandeId = searchParams.get('id') || searchParams.get('demande');
  const type = searchParams.get('type') || 'devis';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animation de succès */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {type === 'audit' ? 'Demande d\'audit envoyée !' : 'Demande envoyée !'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {type === 'audit' 
                ? 'Votre demande d\'audit gratuit a été transmise avec succès. Notre équipe va analyser votre site et vous recontacter rapidement.'
                : 'Votre demande de devis a été transmise avec succès. Notre équipe va l\'étudier et vous recontacter rapidement.'
              }
            </p>
          </motion.div>

          {/* Informations de suivi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email de confirmation</h3>
                <p className="text-gray-400 text-sm">
                  Un email de confirmation vous a été envoyé avec le récapitulatif de votre demande
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Délai de réponse</h3>
                <p className="text-gray-400 text-sm">
                  Nous vous répondrons sous <strong className="text-amber-400">24 heures</strong> avec un devis détaillé
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Suivi personnalisé</h3>
                <p className="text-gray-400 text-sm">
                  Un commercial dédié vous accompagnera tout au long de votre projet
                </p>
              </CardContent>
            </Card>
          </motion.div>


          {/* Prochaines étapes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="border-gray-700 bg-gray-800/30 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 mr-3 text-amber-400" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                    <div>
                      <h4 className="text-white font-medium">Analyse de votre demande</h4>
                      <p className="text-gray-400 text-sm">Notre équipe technique étudie vos besoins et options sélectionnées</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="text-white font-medium">Préparation du devis</h4>
                      <p className="text-gray-400 text-sm">Création d'un devis personnalisé avec planning et tarification détaillée</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="text-white font-medium">Prise de contact</h4>
                      <p className="text-gray-400 text-sm">Un commercial vous contacte pour présenter le devis et répondre à vos questions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/home">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            
            <Link href="/configurateur">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold">
                Nouvelle configuration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Contact d'urgence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 text-sm">
              Une question urgente ? Contactez-nous directement au{" "}
              <a href="tel:+33123456789" className="text-amber-400 hover:text-amber-300 font-medium">
                01 23 45 67 89
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
