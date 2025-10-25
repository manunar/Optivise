"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Target,
  DollarSign,
  Users,
  Building,
  Sparkles,
  ShoppingCart,
  MessageSquare,
  Filter,
  RotateCcw,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";

interface OptionRecommandee {
  id: string;
  nom: string;
  description: string;
  description_courte?: string;
  categorie: string;
  prix_ht?: number;        // Fallback pour anciennes données
  prix_min_ht?: number;    // Prix minimum de la fourchette
  prix_max_ht?: number;    // Prix maximum de la fourchette
  type_option: string;
  code: string;
  temps_realisation_jours?: number;
  obligatoire?: boolean;
  actif?: boolean;
}

// Fonctions utilitaires pour gérer les prix
const formatPriceDisplay = (option: OptionRecommandee): string => {
  const { prix_min_ht, prix_max_ht, prix_ht } = option;
  
  if (prix_min_ht !== undefined && prix_max_ht !== undefined) {
    if (prix_min_ht === prix_max_ht) {
      return prix_min_ht.toLocaleString();
    }
    return `${prix_min_ht.toLocaleString()} - ${prix_max_ht.toLocaleString()}`;
  }
  
  if (prix_ht !== undefined) {
    return prix_ht.toLocaleString();
  }
  
  return "Sur devis";
};

const getMinPrice = (option: OptionRecommandee): number => {
  return option.prix_min_ht ?? option.prix_ht ?? 0;
};

const getMaxPrice = (option: OptionRecommandee): number => {
  return option.prix_max_ht ?? option.prix_ht ?? 0;
};

const RecommandationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [recommendedOptions, setRecommendedOptions] = useState<OptionRecommandee[]>([]);
  const [allOptions, setAllOptions] = useState<OptionRecommandee[]>([]);
  const [questionsReponses, setQuestionsReponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  
  // États pour l'interface
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showQuestionsRecap, setShowQuestionsRecap] = useState(false);

  const iconMap: Record<string, any> = {
    'design': Sparkles,
    'fonctionnalite': Zap,
    'seo': Target,
    'marketing': Users,
    'ecommerce': ShoppingCart,
    'contenu': MessageSquare,
    'technique': Building
  };

  useEffect(() => {
    if (sessionId) {
      fetchRecommandations();
    } else {
      setError("Session non trouvée. Veuillez refaire le questionnaire.");
      setLoading(false);
    }
  }, [sessionId]);

  const fetchRecommandations = async () => {
    try {
      // Récupérer toutes les options disponibles
      const optionsResponse = await fetch('/api/options');
      const optionsData = await optionsResponse.json();
      
      if (!optionsData.success) {
        setError("Erreur lors du chargement des options");
        return;
      }
      
      setAllOptions(optionsData.data);
      
      // Si on a un sessionId, essayer de récupérer les vraies réponses du questionnaire
      if (sessionId) {
        try {
          // Récupérer les réponses depuis le sessionStorage ou localStorage
          const savedAnswers = sessionStorage.getItem(`questionnaire_answers_${sessionId}`);
          
          if (savedAnswers) {
            const parsedAnswers = JSON.parse(savedAnswers);
            
            // Appeler l'API pour obtenir les recommandations et réponses formatées
            const recommendationsResponse = await fetch('/api/configurateur/recommandations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reponses: parsedAnswers }),
            });
            
            const recommendationsData = await recommendationsResponse.json();
            
            if (recommendationsData.success && recommendationsData.reponses_formatees) {
              setQuestionsReponses(recommendationsData.reponses_formatees);
            }
          }
        } catch (e) {
          console.log('Pas de réponses sauvegardées trouvées');
        }
        
        // Pour l'instant, simuler des recommandations basées sur les premières options
        // TODO: Utiliser les vraies recommandations de l'API
        const optionsRecommandees = optionsData.data.slice(0, 8);
        setRecommendedOptions(optionsRecommandees);
        
        // Pré-sélectionner les options recommandées
        const recommendedIds = new Set<string>(optionsRecommandees.map((opt: OptionRecommandee) => opt.id));
        setSelectedOptions(recommendedIds);
      } else {
        // Pas de session, montrer les options populaires
        const optionsPopulaires = optionsData.data.slice(0, 6);
        setRecommendedOptions(optionsPopulaires);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
      setError("Erreur lors du chargement des recommandations");
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const getComplexityColor = (complexite: string) => {
    switch (complexite?.toLowerCase()) {
      case 'simple': return 'text-green-400';
      case 'moyen': return 'text-yellow-400';
      case 'complexe': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getComplexityBadge = (complexite: string) => {
    switch (complexite?.toLowerCase()) {
      case 'simple': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'moyen': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'complexe': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const calculateTotal = () => {
    const { totalMin, totalMax } = Array.from(selectedOptions).reduce((acc, optionId) => {
      const option = allOptions.find((o: OptionRecommandee) => o.id === optionId);
      if (!option) return acc;
      
      const min = getMinPrice(option);
      const max = getMaxPrice(option);
      
      return {
        totalMin: acc.totalMin + min,
        totalMax: acc.totalMax + max
      };
    }, { totalMin: 0, totalMax: 0 });
    
    return { totalMin, totalMax };
  };

  const getCategories = () => {
    const categories = new Set(allOptions.map(opt => opt.categorie).filter(Boolean));
    return Array.from(categories);
  };

  const getFilteredOptions = () => {
    let optionsToShow = showAllOptions ? allOptions : recommendedOptions;
    
    if (selectedCategory !== 'all') {
      optionsToShow = optionsToShow.filter(opt => opt.categorie === selectedCategory);
    }
    
    return optionsToShow;
  };

  const handleProceedToQuote = () => {
    if (selectedOptions.size === 0) {
      alert("Veuillez sélectionner au moins une option pour continuer.");
      return;
    }
    
    // Rediriger vers la page de demande de devis avec les options sélectionnées
    const optionIds = Array.from(selectedOptions).join(',');
    router.push(`/configurateur/devis?options=${optionIds}&session=${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Génération de vos recommandations...</p>
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
          <Link href="/configurateur/assistee">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">
              Refaire le questionnaire
            </Button>
          </Link>
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
            <Link href="/configurateur/assistee" className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au questionnaire
            </Link>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-400/30 px-4 py-2">
              Étape 2/3 - Recommandations
            </Badge>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-amber-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Vos Recommandations
              </span>
            </h1>
          </div>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Basé sur vos réponses, voici les options que nous recommandons pour votre projet.
            Sélectionnez celles qui vous intéressent pour obtenir un devis personnalisé.
          </p>

          {/* Statistiques */}
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{recommendedOptions.length}</div>
              <div className="text-sm text-gray-400">Recommandées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{selectedOptions.size}</div>
              <div className="text-sm text-gray-400">Sélectionnées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {(() => {
                  const { totalMin, totalMax } = calculateTotal();
                  return totalMin === totalMax 
                    ? `${totalMin.toLocaleString()}€` 
                    : `${totalMin.toLocaleString()}€ - ${totalMax.toLocaleString()}€`;
                })()}
              </div>
              <div className="text-sm text-gray-400">Total estimé</div>
            </div>
          </div>
        </motion.div>

        {/* Récapitulatif des réponses du questionnaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <Card className="border-gray-700 bg-gray-800/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-amber-400" />
                  Vos réponses au questionnaire
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuestionsRecap(!showQuestionsRecap)}
                  className="text-gray-400 hover:text-white"
                >
                  {showQuestionsRecap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showQuestionsRecap ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
            </CardHeader>
            {showQuestionsRecap && (
              <CardContent>
                {questionsReponses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 mb-1">Basé sur vos réponses</p>
                        <p className="text-white">Nous avons sélectionné {recommendedOptions.length} options qui correspondent à vos besoins.</p>
                      </div>
                      <div className="p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 mb-1">Personnalisation</p>
                        <p className="text-white">Vous pouvez modifier cette sélection en ajoutant ou supprimant des options.</p>
                      </div>
                    </div>
                    
                    {/* Affichage des vraies réponses */}
                    <div className="space-y-3">
                      <h4 className="text-white font-medium mb-3">Vos réponses au questionnaire :</h4>
                      {questionsReponses.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/20 rounded-lg">
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm font-medium mb-1">{item.question}</p>
                            <div className="text-amber-400 text-sm">
                              {Array.isArray(item.reponse) ? (
                                <div className="flex flex-wrap gap-1">
                                  {item.reponse.map((rep: string, i: number) => (
                                    <Badge key={i} className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                                      {rep}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span>{item.reponse}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 mb-1">Basé sur vos réponses</p>
                      <p className="text-white">Nous avons sélectionné {recommendedOptions.length} options qui correspondent à vos besoins.</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 mb-1">Personnalisation</p>
                      <p className="text-white">Vous pouvez modifier cette sélection en ajoutant ou supprimant des options.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Contrôles et filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Boutons de mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={!showAllOptions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllOptions(false)}
                className={!showAllOptions ? "bg-amber-500 text-black" : "border-gray-600 text-gray-300"}
              >
                <Star className="w-4 h-4 mr-2" />
                Recommandées ({recommendedOptions.length})
              </Button>
              <Button
                variant={showAllOptions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllOptions(true)}
                className={showAllOptions ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
              >
                <Plus className="w-4 h-4 mr-2" />
                Toutes les options ({allOptions.length})
              </Button>
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white rounded px-3 py-1 text-sm"
                >
                  <option value="all">Toutes catégories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOptions(new Set())}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tout désélectionner
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Options */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {getFilteredOptions().map((option: OptionRecommandee, index: number) => {
              const isSelected = selectedOptions.has(option.id);
              const isRecommended = recommendedOptions.some(rec => rec.id === option.id);
              const IconComponent = iconMap[option.categorie] || Zap;
              
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`border transition-all duration-300 cursor-pointer h-full relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-xl shadow-amber-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:shadow-lg'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {/* Badge recommandé */}
                    {isRecommended && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Recommandé
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-lg shadow-lg ${
                          isRecommended 
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-700'
                        }`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-amber-400" />
                        )}
                      </div>
                      
                      <CardTitle className="text-white text-lg mb-2">
                        {option.nom}
                      </CardTitle>
                      
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {option.description_courte || option.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Prix */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Prix</span>
                        <span className="text-amber-400 font-bold">
                          {formatPriceDisplay(option)}€
                        </span>
                      </div>
                      
                      {/* Type d'option */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Type</span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                          {option.type_option}
                        </Badge>
                      </div>
                      
                      {/* Temps de réalisation */}
                      {option.temps_realisation_jours && option.temps_realisation_jours > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Réalisation</span>
                          <span className="text-gray-400 text-sm">
                            {option.temps_realisation_jours} jour{option.temps_realisation_jours > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Catégorie */}
                      {option.categorie && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Catégorie</span>
                          <span className="text-gray-400 text-sm capitalize">
                            {option.categorie}
                          </span>
                        </div>
                      )}
                      
                      {/* Obligatoire */}
                      {option.obligatoire && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Statut</span>
                          <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                            Obligatoire
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Résumé et actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">
                  Récapitulatif de votre sélection
                </h3>
                <p className="text-gray-400">
                  {selectedOptions.size} option{selectedOptions.size > 1 ? 's' : ''} sélectionnée{selectedOptions.size > 1 ? 's' : ''} • 
                  Total estimé: <span className="text-amber-400 font-bold">
                    {(() => {
                      const { totalMin, totalMax } = calculateTotal();
                      return totalMin === totalMax 
                        ? `${totalMin.toLocaleString()}€` 
                        : `${totalMin.toLocaleString()}€ - ${totalMax.toLocaleString()}€`;
                    })()}
                  </span>
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOptions(new Set())}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Tout désélectionner
                </Button>
                
                <Button
                  onClick={handleProceedToQuote}
                  disabled={selectedOptions.size === 0}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-8"
                >
                  Demander un devis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecommandationsPage;
