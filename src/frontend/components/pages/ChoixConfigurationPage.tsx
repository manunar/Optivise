"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { 
  Zap, 
  Settings, 
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sliders,
  Clock,
  Target,
  Users,
  CheckCircle
} from "lucide-react";
import Navbar from "@/frontend/components/layout/Navbar";

const ChoixConfigurationPage = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const configModes = [
    {
      id: "assistee",
      title: "Configuration Assistée",
      subtitle: "Recommandé pour débuter",
      description: "Répondez à quelques questions simples et nous vous recommandons les meilleures options pour votre projet",
      icon: HelpCircle,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "5 questions ciblées",
        "Recommandations personnalisées", 
        "Gain de temps",
        "Optimisé pour votre secteur"
      ],
      duration: "2-3 minutes",
      difficulty: "Facile",
      href: "/configurateur/assistee"
    },
    {
      id: "libre",
      title: "Configuration Libre",
      subtitle: "Pour les utilisateurs expérimentés",
      description: "Explorez toutes les options disponibles et créez votre configuration sur mesure",
      icon: Sliders,
      color: "from-blue-500 to-cyan-600", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "28 options disponibles",
        "Contrôle total",
        "Catégories détaillées",
        "Comparaison avancée"
      ],
      duration: "5-10 minutes",
      difficulty: "Intermédiaire",
      href: "/configurateur/classique"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Link href="/home" className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-400/30 px-4 py-2">
              Étape 1/3
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Comment souhaitez-vous
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Configurer votre Site ?
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choisissez votre approche préférée pour créer votre site web sur mesure
          </p>
        </motion.div>

        {/* Options de configuration */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {configModes.map((mode, index) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card
                    className={`border transition-all duration-300 cursor-pointer h-full ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/5 shadow-2xl shadow-amber-500/20 scale-105'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${mode.color} shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <Badge 
                          variant={mode.id === 'assistee' ? 'default' : 'secondary'}
                          className={mode.id === 'assistee' ? 'bg-green-500/20 text-green-300 border-green-400/30' : ''}
                        >
                          {mode.subtitle}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-white text-2xl mb-2">
                        {mode.title}
                      </CardTitle>
                      
                      <p className="text-gray-400 leading-relaxed">
                        {mode.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Caractéristiques */}
                      <div className="space-y-3">
                        {mode.features.map((feature, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Métadonnées */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{mode.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{mode.difficulty}</span>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-2 text-amber-400"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Sélectionné</span>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Bouton de validation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedMode ? 1 : 0.5 }}
            className="text-center"
          >
            <Link href={selectedMode ? configModes.find(m => m.id === selectedMode)?.href || '/configurateur' : '#'}>
              <Button
                size="lg"
                disabled={!selectedMode}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-12 py-6 text-lg rounded-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            {selectedMode && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-400 mt-4"
              >
                Vous avez choisi la <span className="text-amber-400 font-medium">
                  {configModes.find(m => m.id === selectedMode)?.title}
                </span>
              </motion.p>
            )}
          </motion.div>
        </div>
        
        {/* Aide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <h3 className="text-white font-bold mb-2">Besoin d'aide pour choisir ?</h3>
            <p className="text-gray-400 text-sm">
              La <span className="text-green-400 font-medium">Configuration Assistée</span> est parfaite si c'est votre premier site.
              <br />
              La <span className="text-blue-400 font-medium">Configuration Libre</span> vous donne un contrôle total sur chaque détail.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChoixConfigurationPage;