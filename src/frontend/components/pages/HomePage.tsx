"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { DollarSign } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

// Lazy loading des sections non-critiques
const Portfolio = dynamic(() => import("../sections/Portfolio"), {
  loading: () => <div className="h-96 bg-slate-900/50 animate-pulse rounded-lg" />
});
const Process = dynamic(() => import("../sections/Process"), {
  loading: () => <div className="h-96 bg-slate-900/50 animate-pulse rounded-lg" />
});

// Composant HomePage complet avec shadcn/ui
const HomePage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [mounted, setMounted] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToProcess = () => {
    processRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Positions fixes pour les particules
  const particlePositions = [
    { left: 10, top: 20 }, { left: 80, top: 15 }, { left: 25, top: 60 },
    { left: 70, top: 80 }, { left: 5, top: 45 }, { left: 90, top: 30 },
    { left: 40, top: 10 }, { left: 60, top: 90 }, { left: 15, top: 75 },
    { left: 85, top: 55 }, { left: 30, top: 25 }, { left: 75, top: 70 },
    { left: 50, top: 5 }, { left: 20, top: 85 }, { left: 95, top: 40 },
    { left: 35, top: 50 }, { left: 65, top: 35 }, { left: 45, top: 95 },
    { left: 55, top: 65 }, { left: 25, top: 30 }
  ];

  const FloatingParticles = () => {
    if (!mounted) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-full"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -80, -40, 0],
              scale: [0.5, 1.2, 0.8, 0.5],
              opacity: [0.3, 0.8, 0.4, 0.3],
            }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        ))}
        
        {/* Particules dorées plus grandes */}
        {particlePositions.slice(0, 5).map((pos, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-amber-300/20 to-yellow-400/20 rounded-full blur-sm"
            animate={{
              x: [0, 80, -50, 0],
              y: [0, -120, -60, 0],
              scale: [0.8, 1.5, 1, 0.8],
              opacity: [0.2, 0.6, 0.3, 0.2],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut",
            }}
            style={{
              left: `${pos.left + 10}%`,
              top: `${pos.top + 15}%`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black relative">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background premium */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,162,158,.05)_50%,transparent_75%,transparent_100%)]"></div>
        
        <FloatingParticles />

        <motion.div 
          style={{ y: y1, opacity }}
          className="relative z-10 text-center px-6 max-w-7xl mx-auto"
        >
          {/* Badge premium */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="mb-8"
          >
            <Badge 
              className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30 text-amber-300 px-6 py-3 text-sm font-medium backdrop-blur-xl"
              variant="outline"
            >
              ✨ Innovation & Technologies de pointe
            </Badge>
          </motion.div>

          {/* Titre principal premium */}
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Développement
            </motion.div>
            <motion.div
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Web Premium
            </motion.div>
          </div>
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-gray-400 mb-12 max-w-5xl mx-auto leading-relaxed font-light"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            Nouvelle génération de développement web avec{" "}
            <motion.span
              className="text-white font-medium"
              animate={mounted ? { 
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 0px rgba(255,255,255,0)"
                ]
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              technologies de pointe
            </motion.span>
            <br className="hidden md:block" />
            Innovation, performance et design moderne pour propulser votre business.
          </motion.p>

          {/* Boutons CTA premium */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <Link href="/configurateur">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-16 py-8 text-xl rounded-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 mb-4"
                >
                  <motion.span
                    animate={mounted ? { 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Devis Gratuit
                  </motion.span>
                </Button>
              </Link>
              <p className="text-lg text-gray-200 font-semibold leading-relaxed">
                📋 Configuration en 2 min<br />
                💯 Sans engagement
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <Button 
                size="lg"
                variant="outline"
                onClick={scrollToPortfolio}
                className="border-slate-400/50 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-300 font-semibold px-16 py-8 text-xl rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer mb-4"
              >
                Nos Réalisations
              </Button>
              <p className="text-lg text-gray-200 font-semibold leading-relaxed">
                🎨 Projets concrets<br />
                🚀 Technologies modernes
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <Button 
                size="lg"
                variant="outline"
                onClick={scrollToProcess}
                className="border-slate-400/50 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-300 font-semibold px-16 py-8 text-xl rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer mb-4"
              >
                Notre Processus
              </Button>
              <p className="text-lg text-gray-200 font-semibold leading-relaxed">
                ⚡ 6 étapes simples<br />
                🎯 Transparent et efficace
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Portfolio ref={portfolioRef} />
      <Process ref={processRef} />
      <Footer />
    </div>
  );
};

export default HomePage;