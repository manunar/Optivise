"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useOptions } from "@/hooks/useOptions";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { 
  ShoppingCart, 
  Palette, 
  TrendingUp, 
  Settings, 
  Package,
  Check,
  ArrowLeft,
  Calculator
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/frontend/components/layout/Navbar";

// Types importés du hook
type Option = {
  id: string;
  nom: string;
  description: string;
  prix_ht?: number;        // Fallback pour anciennes données
  prix_min_ht?: number;    // Prix minimum de la fourchette
  prix_max_ht?: number;    // Prix maximum de la fourchette
  categorie: string;
  type_option: string;
  obligatoire: boolean;
  actif: boolean;
};

// Fonction utilitaire pour formater l'affichage des prix
const formatPriceDisplay = (option: Option): string => {
  const { prix_min_ht, prix_max_ht, prix_ht } = option;
  
  // Si on a une fourchette de prix
  if (prix_min_ht !== undefined && prix_max_ht !== undefined) {
    if (prix_min_ht === prix_max_ht) {
      return `${prix_min_ht}€`;
    }
    return `${prix_min_ht}€ - ${prix_max_ht}€`;
  }
  
  // Fallback sur prix_ht si disponible
  if (prix_ht !== undefined) {
    return `${prix_ht}€`;
  }
  
  // Aucun prix disponible
  return "Sur devis";
};

// Fonction pour obtenir le prix min d'une option (pour les calculs)
const getMinPrice = (option: Option): number => {
  return option.prix_min_ht ?? option.prix_ht ?? 0;
};

// Fonction pour obtenir le prix max d'une option (pour les calculs)
const getMaxPrice = (option: Option): number => {
  return option.prix_max_ht ?? option.prix_ht ?? 0;
};

// Configuration des types d'options avec icônes et couleurs
const TYPE_CONFIG = {
  pack_base: {
    label: "Pack de Base",
    icon: Package,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  fonctionnalite: {
    label: "Fonctionnalités",
    icon: Settings,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  design: {
    label: "Design & UX",
    icon: Palette,
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  marketing: {
    label: "Marketing",
    icon: TrendingUp,
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  maintenance: {
    label: "Maintenance",
    icon: ShoppingCart,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  }
};

// Configuration des couleurs de catégories
const CATEGORY_COLORS = {
  base: "bg-purple-100 text-purple-800",
  formation: "bg-blue-100 text-blue-800",
  animation: "bg-pink-100 text-pink-800",
  ecommerce: "bg-indigo-100 text-indigo-800",
  localisation: "bg-emerald-100 text-emerald-800",
  communication: "bg-green-100 text-green-800",
  responsive: "bg-cyan-100 text-cyan-800",
  design: "bg-rose-100 text-rose-800",
  analytics: "bg-amber-100 text-amber-800",
  social_proof: "bg-lime-100 text-lime-800",
  social: "bg-teal-100 text-teal-800",
  crm: "bg-violet-100 text-violet-800",
  theme: "bg-fuchsia-100 text-fuchsia-800",
  contenu: "bg-slate-100 text-slate-800",
  email: "bg-red-100 text-red-800",
  performance: "bg-yellow-100 text-yellow-800",
  payment: "bg-green-100 text-green-800",
  publicite: "bg-blue-100 text-blue-800",
  conversion: "bg-orange-100 text-orange-800",
  booking: "bg-indigo-100 text-indigo-800",
  backup: "bg-gray-100 text-gray-800",
  seo: "bg-purple-100 text-purple-800",
  securite: "bg-red-100 text-red-800"
};

const ConfigurateurPage = () => {
  const { options, loading, error } = useOptions();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("pack_base");
  const router = useRouter();

  // Auto-sélectionner les options obligatoires quand les options sont chargées
  useEffect(() => {
    if (!loading && options.length > 0 && selectedOptions.length === 0) {
      const obligatoires = options.filter(opt => opt.obligatoire).map(opt => opt.id);
      if (obligatoires.length > 0) {
        setSelectedOptions(obligatoires);
      }
    }
  }, [loading, options, selectedOptions.length]);

  // Grouper les options par type
  const optionsByType = options.reduce((acc, option) => {
    if (!acc[option.type_option]) {
      acc[option.type_option] = [];
    }
    acc[option.type_option].push(option);
    return acc;
  }, {} as Record<string, Option[]>);

  // Calculer la fourchette de prix totale
  const { totalMin, totalMax } = selectedOptions.reduce((acc, optionId) => {
    const option = options.find(opt => opt.id === optionId);
    if (!option) return acc;
    
    const min = getMinPrice(option);
    const max = getMaxPrice(option);
    
    return {
      totalMin: acc.totalMin + min,
      totalMax: acc.totalMax + max
    };
  }, { totalMin: 0, totalMax: 0 });

  const handleContinue = () => {
    // Construire l'URL avec les options sélectionnées
    const optionsParam = selectedOptions.join(',');
    router.push(`/configurateur/devis?options=${encodeURIComponent(optionsParam)}`);
  };

  const handleOptionToggle = (optionId: string) => {
    const option = options.find(opt => opt.id === optionId);
    
    // Ne pas permettre de désélectionner les options obligatoires
    if (option?.obligatoire && selectedOptions.includes(optionId)) {
      return;
    }
    
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const getCategoryColor = (categorie: string) => {
    return CATEGORY_COLORS[categorie as keyof typeof CATEGORY_COLORS] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Chargement du configurateur...</p>
        </div>
      </div>
    );
  }

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
            <Link href="/home" className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-400/30 px-4 py-2">
              Configurateur de projet
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Configurez votre
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Site Web Premium
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sélectionnez les options qui correspondent à vos besoins. 
            Notre configurateur vous guide pour créer le site parfait.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Options */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-transparent p-0 h-auto">
                {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const count = optionsByType[key]?.length || 0;
                  
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="flex flex-col items-center p-4 data-[state=active]:bg-amber-500/20"
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-sm font-medium">{config.label}</span>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(TYPE_CONFIG).map(([typeKey, config]) => (
                <TabsContent key={typeKey} value={typeKey}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <config.icon className="w-6 h-6 mr-3 text-amber-400" />
                      {config.label}
                    </h2>
                    
                    <div className="grid gap-4">
                      {optionsByType[typeKey]?.map((option) => (
                        <Card
                          key={option.id}
                          className={`border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl ${
                            selectedOptions.includes(option.id)
                              ? 'border-gray-600 bg-amber-500/5 shadow-lg shadow-amber-500/20'
                              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                          }`}
                          onClick={() => handleOptionToggle(option.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <Checkbox
                                  checked={selectedOptions.includes(option.id)}
                                  disabled={option.obligatoire}
                                  className="mt-1 pointer-events-none flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <CardTitle className="text-white text-lg">
                                      {option.nom}
                                    </CardTitle>
                                    <Badge className={getCategoryColor(option.categorie)}>
                                      {option.categorie}
                                    </Badge>
                                    {option.obligatoire && (
                                      <Badge variant="destructive">
                                        Obligatoire
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-400 text-sm mb-2">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 min-w-[120px]">
                                <div className="text-xl font-bold text-amber-400 whitespace-nowrap">
                                  {formatPriceDisplay(option)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  HT
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )) || (
                        <div className="text-center py-12">
                          <p className="text-gray-500">Aucune option disponible dans cette catégorie</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-amber-400" />
                  Résumé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total en haut */}
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total HT</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {totalMin === totalMax 
                        ? `${totalMin}€` 
                        : `${totalMin}€ - ${totalMax}€`
                      }
                    </span>
                  </div>
                </div>
                
                {/* Liste des options */}
                <div className="space-y-3">
                  {selectedOptions.map(optionId => {
                    const option = options.find(opt => opt.id === optionId);
                    if (!option) return null;
                    
                    return (
                      <div key={optionId} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{option.nom}</p>
                          <Badge className={`${getCategoryColor(option.categorie)} text-xs mt-1`}>
                            {option.categorie}
                          </Badge>
                        </div>
                        <span className="text-amber-400 font-bold">
                          {formatPriceDisplay(option)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {selectedOptions.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Aucune option sélectionnée
                  </p>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold"
                    disabled={selectedOptions.length === 0}
                  >
                    Continuer
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Devis détaillé à l'étape suivante
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurateurPage;