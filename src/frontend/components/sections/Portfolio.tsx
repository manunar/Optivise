"use client";

import { motion } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { forwardRef } from "react";

const Portfolio = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-950 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,162,158,.03)_50%,transparent_75%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Nos
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-black ml-4">
              Réalisations
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light">
            Découvrez nos projets réalisés avec passion et expertise technique
          </p>
        </motion.div>

        {/* Grid Portfolio Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "E-commerce Premium",
              category: "E-commerce",
              tech: ["Next.js", "Stripe", "Tailwind"],
              description: "Plateforme de vente haut de gamme avec expérience utilisateur optimisée"
            },
            {
              title: "Application SaaS",
              category: "Web App",
              tech: ["React", "Node.js", "PostgreSQL"],
              description: "Interface moderne pour gestion d'entreprise avec dashboard analytics"
            },
            {
              title: "Site Vitrine Corporate",
              category: "Vitrine",
              tech: ["Next.js", "Framer Motion", "CMS"],
              description: "Présence digitale élégante pour cabinet de conseil en stratégie"
            },
            {
              title: "Marketplace B2B",
              category: "E-commerce",
              tech: ["Vue.js", "Laravel", "Redis"],
              description: "Plateforme de mise en relation professionnelle avec système d'enchères"
            },
            {
              title: "Portfolio Créatif",
              category: "Portfolio",
              tech: ["Gatsby", "Three.js", "GSAP"],
              description: "Site immersif pour artiste digital avec animations 3D interactives"
            },
            {
              title: "Application Mobile PWA",
              category: "Mobile",
              tech: ["React Native", "Firebase", "PWA"],
              description: "App hybride pour gestion de projet avec synchronisation temps réel"
            }
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1 
              }}
              whileHover={{ 
                y: -15, 
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-xl border border-amber-500/20 h-full hover:border-amber-400/50 transition-all duration-500 shadow-2xl hover:shadow-amber-500/20 overflow-hidden">
                
                {/* Image Placeholder - Future DB Integration */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10"
                    animate={{ 
                      background: [
                        "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.1))",
                        "linear-gradient(45deg, rgba(234, 179, 8, 0.1), rgba(245, 158, 11, 0.1))",
                        "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.1))"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Badge Catégorie */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="outline"
                      className="bg-black/50 border-amber-400/50 text-amber-300 backdrop-blur-sm"
                    >
                      {project.category}
                    </Badge>
                  </div>

                  {/* Overlay Hover */}
                  <motion.div 
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-amber-500 hover:bg-amber-400 text-black p-3 rounded-full cursor-pointer"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>

                <CardHeader className="pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {project.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: techIndex * 0.1 }}
                        className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline"
                      className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300"
                      size="sm"
                    >
                      Voir le Projet
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Portfolio */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg"
            variant="outline"
            className="border-amber-400/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 font-semibold px-8 py-4 text-lg rounded-lg backdrop-blur-xl transition-all duration-300"
          >
            Voir Tous Nos Projets
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

Portfolio.displayName = "Portfolio";

export default Portfolio;