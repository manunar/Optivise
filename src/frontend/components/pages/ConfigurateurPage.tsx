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
  Calculator,
  Zap
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
  automatisation: {
    label: "Automatisation",
    icon: Zap,
    color: "from-indigo-500 to-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
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
  automatisation: "bg-emerald-100 text-emerald-800",
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
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pack_base");
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const router = useRouter();

  // Helper pour vérifier si une option est une automatisation (insensible à la casse)
  const isAutomation = (option: Option) => {
    return option.categorie?.toLowerCase().trim() === 'automatisation' || 
           option.type_option?.toLowerCase().trim() === 'automatisation';
  };

  // Auto-sélectionner les options obligatoires quand les options sont chargées
  useEffect(() => {
    if (!loading && options.length > 0 && selectedOptions.length === 0) {
      const obligatoires = options.filter(opt => opt.obligatoire).map(opt => opt.id);
      if (obligatoires.length > 0) {
        setSelectedOptions(obligatoires);
      }
    }
  }, [loading, options, selectedOptions.length]);

  // Afficher le modal automatisation quand l'utilisateur arrive sur l'onglet
  useEffect(() => {
    if (activeTab === 'automatisation' && !showAutomationModal) {
      // Petit délai pour que l'utilisateur voie la page avant le popup
      const timer = setTimeout(() => setShowAutomationModal(true), 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Grouper les options par type
  const optionsByType = options.reduce((acc, option) => {
    if (!acc[option.type_option]) {
      acc[option.type_option] = [];
    }
    acc[option.type_option].push(option);
    return acc;
  }, {} as Record<string, Option[]>);

  // S'assurer que les options catégorisées 'automatisation' apparaissent
  // dans l'onglet 'automatisation' même si leur type_option n'est pas défini ainsi.
  if (!optionsByType['automatisation']) optionsByType['automatisation'] = [];
  options.forEach(opt => {
    if (isAutomation(opt) && !optionsByType['automatisation'].some(o => o.id === opt.id)) {
      optionsByType['automatisation'].push(opt);
    }
  });

  // Calculer la fourchette de prix totale
  const totals = selectedOptions.reduce((acc, optionId) => {
    const option = options.find(opt => opt.id === optionId);
    if (!option) return acc;

    // Ne pas inclure les options de la catégorie 'automatisation' dans le total monétaire
    if (isAutomation(option)) {
      acc.automationCount += 1;
      acc.automationIds.push(optionId);
      return acc;
    }

    const min = getMinPrice(option);
    const max = getMaxPrice(option);

    acc.totalMin += min;
    acc.totalMax += max;
    return acc;
  }, { totalMin: 0, totalMax: 0, automationCount: 0 as number, automationIds: [] as string[] });

  const { totalMin, totalMax, automationCount, automationIds } = totals;

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
      
      {/* Modal Automatisation */}
      {showAutomationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-amber-500/30 overflow-hidden"
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl"
              >
                <Zap className="w-12 h-12 text-amber-500" />
              </motion.div>
              <h2 className="text-3xl font-black text-black mb-2">
                ⚡ Automatisations Intelligentes
              </h2>
              <p className="text-black/80 font-semibold text-lg">
                Gagnez du temps et de l'argent avec nos solutions sur-mesure
              </p>
            </div>

            {/* Contenu */}
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Économisez des heures chaque semaine</h3>
                    <p className="text-gray-400">Les tâches répétitives sont automatisées : réponses clients, relances, suivi des commandes...</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Augmentez vos conversions de 30% en moyenne</h3>
                    <p className="text-gray-400">Relances automatiques, chatbot 24/7, récupération de paniers abandonnés...</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">100% personnalisable selon vos besoins</h3>
                    <p className="text-gray-400">Chaque automatisation est adaptée à votre activité et vos processus métier.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  💡 <strong>Abonnement flexible :</strong> Les automatisations ci-dessous sont facturées mensuellement ou annuellement. 
                  Sélectionnez celles qui vous intéressent pour recevoir un devis personnalisé et découvrir combien vous pourriez économiser.
                </p>
              </div>

              {/* Bouton */}
              <div className="text-center pt-4">
                <Button
                  onClick={() => setShowAutomationModal(false)}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-8 py-3 text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
                >
                  Découvrir les automatisations
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
              <TabsList className="grid w-full grid-cols-6 mb-8 bg-transparent p-0 h-auto gap-2">
                {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const count = optionsByType[key]?.length || 0;
                  const isAutomationTab = key === 'automatisation';
                  
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className={`flex flex-col items-center p-4 transition-all duration-300 ${
                        isAutomationTab 
                          ? 'data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black data-[state=active]:shadow-xl data-[state=active]:shadow-amber-500/50 data-[state=inactive]:bg-gradient-to-br data-[state=inactive]:from-amber-500/20 data-[state=inactive]:to-yellow-600/20 data-[state=inactive]:border-2 data-[state=inactive]:border-amber-500/50 data-[state=inactive]:shadow-lg data-[state=inactive]:shadow-amber-500/20 hover:scale-105'
                          : 'data-[state=active]:bg-amber-500/20'
                      }`}
                    >
                      <div className={isAutomationTab ? 'relative' : ''}>
                        {isAutomationTab && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
                          />
                        )}
                        <Icon className={`w-5 h-5 mb-1 ${isAutomationTab && activeTab !== 'automatisation' ? 'text-amber-400' : ''}`} />
                      </div>
                      <span className={`text-sm font-medium ${isAutomationTab && activeTab !== 'automatisation' ? 'text-amber-400 font-bold' : ''}`}>
                        {config.label}
                        {isAutomationTab && activeTab !== 'automatisation' && ' ⚡'}
                      </span>
                      <Badge variant="secondary" className={`text-xs mt-1 ${isAutomationTab ? 'bg-amber-900 text-amber-200' : ''}`}>
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

                    {/* Message explicatif pour l'onglet Automatisation */}
                    {typeKey === 'automatisation' && (
                      <div className="mb-6 p-6 rounded-lg border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 shadow-lg shadow-amber-500/20">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="w-7 h-7 text-black" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-amber-400 mb-2">⚡ Automatisations Intelligentes — Gagnez du temps & de l'argent</h3>
                            <p className="text-gray-300 text-sm mb-3">
                              Les automatisations ci-dessous sont des <strong>exemples</strong> de ce qui est réalisable. 
                              Elles sont <strong>très personnalisables</strong> et facturées sous forme d'<strong>abonnement mensuel ou annuel</strong>. 
                              Sélectionnez celles qui vous intéressent pour les inclure dans votre demande de devis personnalisée.
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-amber-400">
                              <span className="bg-amber-500/20 px-3 py-1 rounded-full">💰 ROI rapide</span>
                              <span className="bg-amber-500/20 px-3 py-1 rounded-full">⏰ Économie de temps</span>
                              <span className="bg-amber-500/20 px-3 py-1 rounded-full">📈 +30% conversions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid gap-4">
                      {optionsByType[typeKey]?.map((option) => (
                        <Card
                          key={option.id}
                          className={`border transition-all duration-300 cursor-pointer ${
                            isAutomation(option)
                              ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/30'
                              : ''
                          } ${
                            selectedOptions.includes(option.id)
                              ? 'border-gray-600 bg-amber-500/5 shadow-lg shadow-amber-500/20'
                              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                          } hover:scale-[1.02] hover:shadow-xl`}
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

                                  {/* Bouton pour développer la description complète si c'est le pack essentiel */}
                                  {option.nom && option.nom.toLowerCase().includes('pack essentiel') && (
                                    <div className="mt-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setExpandedOptionId(prev => prev === option.id ? null : option.id); }}
                                        className="text-sm text-amber-400 hover:underline"
                                        aria-expanded={expandedOptionId === option.id}
                                      >
                                        {expandedOptionId === option.id ? 'Masquer la description' : 'Voir la description complète'}
                                      </button>
                                    </div>
                                  )}

                                  {/* Description complète développable */}
                                  {expandedOptionId === option.id && (
                                    <div className="mt-3 border border-gray-700 rounded-md bg-gray-900/40 p-4 text-gray-300">
                                      <p className="mb-2">Le pack essentiel comprend tout ce dont vous avez besoin pour créer un site professionnel, simple et efficace. Idéal pour une première présence en ligne, ce pack comprend :</p>
                                      <ul className="list-disc list-inside mb-2 space-y-1">
                                        <li><strong>Domaine et Hébergement annuel</strong> — Votre site sera accessible sur un nom de domaine personnalisé et hébergé sur des serveurs sécurisés.</li>
                                        <li><strong>Design personnalisé</strong> — Création d’un design moderne et adapté à votre secteur d'activité. Un site à votre image.</li>
                                        <li><strong>3 pages principales</strong> — Accueil, Contact, et Services/Produits : structure de base pour présenter votre activité, vos produits et permettre la prise de contact.</li>
                                        <li><strong>Responsive Design</strong> — Votre site sera accessible sur tous les appareils (mobile, tablette, ordinateur) pour toucher un maximum de clients.</li>
                                        <li><strong>Formulaire de contact</strong> — Un formulaire intégré pour que vos visiteurs puissent vous joindre directement depuis le site.</li>
                                      </ul>
                                      <p className="text-sm text-gray-400">Remarque : les catégories suivantes (Fonctionnalités, Design & UX, Marketing, Maintenance...) contiennent uniquement des <em>options supplémentaires</em> que vous pouvez ajouter au pack essentiel pour étendre les fonctionnalités de votre site.</p>
                                    </div>
                                  )}
                                </div> 
                              </div>
                              <div className="text-right flex-shrink-0 min-w-[120px]">
                                {isAutomation(option) ? (
                                  <>
                                    <div className="text-sm font-bold text-amber-400">Sur demande</div>
                                    <div className="text-xs text-gray-500">Abonnement</div>
                                    <div className="text-xs text-gray-500">(mensuel / annuel)</div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-xl font-bold text-amber-400 whitespace-nowrap">
                                      {formatPriceDisplay(option)}
                                    </div>
                                    <div className="text-xs text-gray-500">HT</div>
                                  </>
                                )}
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
                      {automationCount > 0 && (
                        <span className="text-sm text-gray-400 ml-2">+ {automationCount} automatisation{automationCount > 1 ? 's' : ''} (sur demande)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Liste des options */}
                <div className="space-y-3">
                  {selectedOptions.map(optionId => {
                    const option = options.find(opt => opt.id === optionId);
                    if (!option) return null;
                    
                    const isAutoOption = isAutomation(option);

                    return (
                      <div key={optionId} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{option.nom}</p>
                          <Badge className={`${getCategoryColor(option.categorie)} text-xs mt-1`}>
                            {option.categorie}
                          </Badge>
                          {isAutoOption && (
                            <p className="text-xs text-gray-500 mt-1">Automatisation — tarif sur demande</p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isAutoOption ? (
                            <span className="text-sm text-amber-400 font-medium">—</span>
                          ) : (
                            <span className="text-amber-400 font-bold">{formatPriceDisplay(option)}</span>
                          )}
                        </div>
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