"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Progress } from "@/frontend/components/ui/progress";
import { 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building,
  Target,
  DollarSign,
  Zap,
  Users,
  Check
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";

interface Question {
  id: number;
  question: string;
  type_question: string;
  categorie: string;
  ordre_affichage: number;
}

interface ReponseOption {
  id: number;
  question_id: number;
  valeur: string;
  score_impact: number;
  options_recommandees: string[];
}

const QuestionsConfigurationPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reponses, setReponses] = useState<Record<string, ReponseOption[]>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const iconMap: Record<string, any> = {
    'building': Building,
    'target': Target,
    'dollar-sign': DollarSign,
    'zap': Zap,
    'users': Users
  };

  useEffect(() => {
    initializeSession();
  }, []);

  // Sauvegarde automatique quand les réponses changent
  useEffect(() => {
    if (sessionToken && Object.keys(userAnswers).length > 0) {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, 1000); // Sauvegarde après 1 seconde d'inactivité
      
      return () => clearTimeout(timeoutId);
    }
  }, [userAnswers, sessionToken]);

  const initializeSession = async () => {
    try {
      // Vérifier s'il y a une session existante dans localStorage
      const existingToken = localStorage.getItem('questionnaire_session_token');
      
      if (existingToken) {
        // Essayer de récupérer la session existante
        const response = await fetch(`/api/sessions/${existingToken}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.statut !== 'devis_demande') {
            // Restaurer la session
            setSessionToken(existingToken);
            setUserAnswers(data.data.reponses || {});
            console.log('Session restaurée:', existingToken);
          }
        }
      }
      
      // Si pas de session valide, en créer une nouvelle
      if (!sessionToken) {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create' })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSessionToken(data.data.session_token);
            localStorage.setItem('questionnaire_session_token', data.data.session_token);
            console.log('Nouvelle session créée:', data.data.session_token);
          }
        }
      }
    } catch (error) {
      console.error('Erreur initialisation session:', error);
    }
    
    // Charger les questions
    await fetchQuestions();
  };

  const saveProgress = async () => {
    if (!sessionToken || isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          session_token: sessionToken,
          reponses: userAnswers,
          statut: 'en_cours'
        })
      });
      
      if (response.ok) {
        setLastSaved(new Date());
        console.log('Progression sauvegardée');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/configurateur/questions');
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
        
        // Organiser les réponses par question_id (qui sont des UUIDs)
        const reponsesGroupees: Record<string, ReponseOption[]> = {};
        if (data.reponses && Array.isArray(data.reponses)) {
          data.reponses.forEach((reponse: any) => {
            if (!reponsesGroupees[reponse.question_id]) {
              reponsesGroupees[reponse.question_id] = [];
            }
            // Parser les recommandations en sécurité
            let recommandations: string[] = [];
            try {
              if (reponse.recommandations) {
                // Si c'est déjà un array, l'utiliser directement
                if (Array.isArray(reponse.recommandations)) {
                  recommandations = reponse.recommandations;
                } else {
                  // Sinon, essayer de parser le JSON
                  recommandations = JSON.parse(reponse.recommandations);
                }
              }
            } catch (e) {
              console.warn(`JSON invalide pour recommandations (ID: ${reponse.id}):`, reponse.recommandations);
              recommandations = [];
            }

            reponsesGroupees[reponse.question_id].push({
              id: reponse.id,
              question_id: reponse.question_id,
              valeur: reponse.reponse, // Dans votre DB c'est "reponse"
              score_impact: 0, // Pas de score_impact dans votre DB
              options_recommandees: recommandations
            });
          });
        }
        setReponses(reponsesGroupees);
        
        // Debug: Afficher les données chargées
        console.log('Questions chargées:', data.questions);
        console.log('Réponses groupées:', reponsesGroupees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string, isMultiple: boolean = false) => {
    setUserAnswers(prev => {
      const newAnswers = isMultiple 
        ? (() => {
            const currentAnswers = prev[questionId] as string[] || [];
            const isSelected = currentAnswers.includes(answer);
            
            if (isSelected) {
              // Retirer la réponse si elle est déjà sélectionnée
              return {
                ...prev,
                [questionId]: currentAnswers.filter(a => a !== answer)
              };
            } else {
              // Ajouter la réponse
              return {
                ...prev,
                [questionId]: [...currentAnswers, answer]
              };
            }
          })()
        : {
            // Sélection simple (comportement actuel)
            ...prev,
            [questionId]: answer
          };

      // La redirection vers l'audit se fera dans goToNextQuestion() si nécessaire

      return newAnswers;
    });
  };

  const goToNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Vérifier si on quitte la question 3 avec "Site existant obsolète" sélectionné
    if (currentQuestion?.id === 3 && userAnswers[3] === "Site existant obsolète") {
      // Rediriger vers la page d'audit dédiée
      router.push('/audit');
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitAnswers();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAnswers = async () => {
    setIsSubmitting(true);
    
    try {
      // Sauvegarder une dernière fois avant de continuer
      if (sessionToken) {
        await saveProgress();
      }
      
      const response = await fetch('/api/configurateur/recommandations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reponses: userAnswers }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Utiliser notre sessionToken existant ou celui retourné par l'API
        const finalSessionToken = sessionToken || data.sessionId;
        
        // Sauvegarder les réponses dans le sessionStorage pour les récupérer plus tard
        sessionStorage.setItem(`questionnaire_answers_${finalSessionToken}`, JSON.stringify(userAnswers));
        
        // Marquer la session comme terminée
        if (sessionToken) {
          await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save',
              session_token: sessionToken,
              reponses: userAnswers,
              statut: 'termine'
            })
          });
        }
        
        // Rediriger vers la page de recommandations
        router.push(`/configurateur/recommandations?session=${finalSessionToken}`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  // La logique de sélection multiple est maintenant gérée par la colonne DB

  const currentQuestion = questions[currentQuestionIndex];
  const currentReponses = currentQuestion ? reponses[currentQuestion.id] || [] : [];
  
  // Debug: Afficher la question actuelle et ses réponses
  console.log('Question actuelle:', currentQuestion);
  console.log('Réponses pour cette question:', currentReponses);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Vérifier si la question actuelle a une réponse
  const hasCurrentAnswer = currentQuestion && (() => {
    const answer = userAnswers[currentQuestion.id];
    const isMultiple = currentQuestion.type_question === 'choix_multiple';
    if (isMultiple) {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      return typeof answer === 'string' && answer.length > 0;
    }
  })();

  // Pour l'instant, utilisons une icône par défaut basée sur la catégorie
  const getIconForCategory = (categorie: string) => {
    if (categorie?.includes('diagnostic')) return Building;
    if (categorie?.includes('commercial')) return DollarSign;
    if (categorie?.includes('marketing')) return Zap;
    if (categorie?.includes('gestion')) return Users;
    return Target;
  };
  
  const IconComponent = currentQuestion ? getIconForCategory(currentQuestion.categorie) : Target;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Link href="/configurateur" className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au choix
            </Link>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-400/30 px-4 py-2">
              Configuration Assistée
            </Badge>
            
            {/* Indicateur de sauvegarde */}
            {sessionToken && (
              <div className="ml-4 flex items-center text-sm text-gray-400">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-amber-400 mr-2"></div>
                    Sauvegarde...
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Sauvegardé {lastSaved.toLocaleTimeString()}
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                    Session active
                  </>
                )}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Configuration Assistée
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
            Répondez à {questions.length} questions pour recevoir des recommandations personnalisées
          </p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Question */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-gray-700 bg-gray-800/50 mb-8">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="p-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <CardTitle className="text-white text-2xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4">
                  {currentReponses.map((reponse) => {
                    const isMultiple = currentQuestion.type_question === 'choix_multiple';
                    let isSelected = false;
                    
                    if (isMultiple) {
                      const currentAnswers = userAnswers[currentQuestion.id] as string[] || [];
                      isSelected = currentAnswers.includes(reponse.valeur);
                    } else {
                      isSelected = userAnswers[currentQuestion.id] === reponse.valeur;
                    }
                    
                    return (
                      <motion.div
                        key={reponse.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                          onClick={() => handleAnswerSelect(currentQuestion.id, reponse.valeur, isMultiple)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isMultiple ? (
                                <Checkbox
                                  checked={isSelected}
                                  className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                />
                              ) : (
                                <div className={`w-5 h-5 rounded-full border-2 ${
                                  isSelected 
                                    ? 'border-amber-500 bg-amber-500' 
                                    : 'border-gray-400'
                                }`}>
                                  {isSelected && (
                                    <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                  )}
                                </div>
                              )}
                              <span className="text-white text-lg font-medium">
                                {reponse.valeur}
                              </span>
                            </div>
                            {isSelected && !isMultiple && (
                              <CheckCircle className="w-6 h-6 text-amber-400" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  {hasCurrentAnswer 
                    ? (currentQuestion.type_question === 'choix_multiple' ? 'Réponse(s) sélectionnée(s)' : 'Réponse sélectionnée')
                    : (currentQuestion.type_question === 'choix_multiple' ? 'Sélectionnez une ou plusieurs réponses' : 'Sélectionnez une réponse')
                  }
                </p>
                {hasCurrentAnswer && (
                  <div className="text-amber-400 font-medium">
                    {currentQuestion.type_question === 'choix_multiple' ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        {(userAnswers[currentQuestion.id] as string[]).map((answer, index) => (
                          <Badge key={index} className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                            {answer}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span>{userAnswers[currentQuestion.id] as string}</span>
                    )}
                  </div>
                )}
                
                {/* Message spécial pour "Site existant obsolète" */}
                {currentQuestion?.id === 3 && userAnswers[3] === "Site existant obsolète" && (
                  <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      🔍 Pour une refonte, nous devons analyser votre site actuel.<br />
                      <strong>Audit gratuit de 30 minutes offert !</strong>
                    </p>
                  </div>
                )}
              </div>
              
              <Button
                onClick={goToNextQuestion}
                disabled={!hasCurrentAnswer || isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-8"
              >
                {isSubmitting 
                  ? 'Génération...' 
                  : currentQuestion?.id === 3 && userAnswers[3] === "Site existant obsolète"
                    ? 'Demander un audit gratuit'
                    : isLastQuestion 
                      ? 'Voir mes recommandations' 
                      : 'Suivant'
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Résumé des réponses */}
        {Object.keys(userAnswers).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <Card className="border-gray-700 bg-gray-800/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Vos réponses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {questions.slice(0, currentQuestionIndex + 1).map((question) => {
                    const answer = userAnswers[question.id];
                    return (
                      <div key={question.id} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 text-sm font-medium">{question.question}</p>
                          <div className="text-amber-400 text-sm">
                            {question.type_question === 'choix_multiple' && Array.isArray(answer) ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {answer.map((ans, index) => (
                                  <Badge key={index} className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                                    {ans}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span>{answer as string}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestionsConfigurationPage;