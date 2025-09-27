"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { forwardRef, useRef } from "react";

const Process = forwardRef<HTMLElement>((props, ref) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const processSteps = [
    {
      number: "01",
      title: "Configuration Gratuite",
      description: "Configurez votre projet en 2 minutes",
      icon: "⚙️",
      duration: "2 minutes",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      features: ["Configurateur guidé", "Prix en temps réel", "Recommandations secteur", "Aucun engagement"]
    },
    {
      number: "02", 
      title: "Premier Contact sous 24h",
      description: "Nous vous recontactons rapidement",
      icon: "📞",
      duration: "< 24h",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      features: ["Email personnalisé", "Analyse de votre demande", "Conseils secteur", "RDV téléphonique"]
    },
    {
      number: "03",
      title: "Devis Personnalisé",
      description: "Votre offre sur mesure",
      icon: "📋",
      duration: "48h",
      color: "from-indigo-500/20 to-blue-500/20", 
      borderColor: "border-indigo-500/30",
      features: ["Ajusté à vos besoins", "Devis PDF détaillé", "Prix transparent", "30 jours pour décider"]
    },
    {
      number: "04",
      title: "Signature et Lancement",
      description: "Démarrage de votre projet",
      icon: "✍️",
      duration: "1 jour",
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30", 
      features: ["Signature électronique", "Acompte 30%", "Espace de suivi", "Planning personnalisé"]
    },
    {
      number: "05",
      title: "Réalisation avec Suivi",
      description: "Votre site prend forme",
      icon: "🔨",
      duration: "1-3 semaines",
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30", 
      features: ["Collecte contenus", "Validation étapes", "Site de test", "Communication régulière"]
    },
    {
      number: "06",
      title: "Livraison et Formation",
      description: "Votre site est en ligne",
      icon: "🚀",
      duration: "1 jour",
      color: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/30", 
      features: ["Formation 1h", "Mise en ligne", "Tous les accès", "Support 30j gratuit"]
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-gray-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,162,158,.02)_50%,transparent_75%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Titre Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Badge 
              className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30 text-amber-300 px-6 py-3 text-sm font-medium backdrop-blur-xl"
              variant="outline"
            >
              ⚡ Simple et Transparent
            </Badge>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Notre Processus en
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-black ml-4">
              6 Étapes Simples
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light">
            De la configuration gratuite à la mise en ligne : un parcours transparent et sans surprise
          </p>
        </motion.div>

        {/* Timeline Process */}
        <div className="relative" ref={timelineRef}>
          {/* Ligne centrale verticale - fond statique */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-800/50 rounded-full hidden lg:block"></div>
          
          {/* Ligne centrale verticale - animation */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-amber-500 via-amber-400 to-yellow-500 rounded-full hidden lg:block origin-top"
            style={{ height: lineHeight }}
          ></motion.div>
          
          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2 
                }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Contenu Step */}
                <div className="flex-1 w-full">
                  <motion.div
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3, type: "spring", stiffness: 300 }
                    }}
                    className="group"
                  >
                    <Card className={`bg-gradient-to-br from-slate-900/90 to-black/70 backdrop-blur-xl border ${step.borderColor} hover:border-amber-400/50 transition-all duration-500 shadow-2xl hover:shadow-amber-500/20 overflow-hidden`}>
                      {/* Header Card avec Gradient */}
                      <div className={`h-2 bg-gradient-to-r ${step.color.replace('/20', '')}`}></div>
                      
                      <CardContent className="p-8">
                        {/* Badge numéro + durée */}
                        <div className="flex items-center justify-between mb-6">
                          <motion.div 
                            className="flex items-center gap-4"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                              {step.number}
                            </div>
                            <div className="text-4xl">{step.icon}</div>
                          </motion.div>
                          <Badge 
                            variant="outline"
                            className="bg-amber-500/10 border-amber-400/30 text-amber-300 text-xs"
                          >
                            {step.duration}
                          </Badge>
                        </div>

                        {/* Titre et description */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 mb-4">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                          {step.description}
                        </p>

                        {/* Features list */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: featureIndex * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-center gap-2 text-sm text-gray-300"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex-shrink-0"></div>
                              <span className="font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Numéro Central (Desktop) */}
                <div className="hidden lg:flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.3,
                      type: "spring", 
                      stiffness: 200,
                      damping: 15
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.8, type: "spring" }
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 z-10 relative"
                  >
                    <div className="text-2xl">{step.icon}</div>
                    {/* Pulse effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"
                    />
                  </motion.div>
                </div>

                {/* Spacer pour équilibrer */}
                <div className="flex-1 hidden lg:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-12 py-6 text-lg rounded-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
            >
              Démarrer Mon Projet
            </Button>
          </motion.div>
          <p className="text-gray-400 mt-4 text-sm">
            🕒 Réponse sous 24h • 📞 Consultation gratuite • ✨ Devis personnalisé
          </p>
        </motion.div>
      </div>
    </section>
  );
});

Process.displayName = "Process";

export default Process;