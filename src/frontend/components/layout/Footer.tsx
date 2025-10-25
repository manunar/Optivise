"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DollarSign, Mail, Phone, MapPin, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Sites Vitrine", href: "/services/vitrine" },
      { name: "E-commerce", href: "/services/ecommerce" },
      { name: "Applications Web", href: "/services/webapp" },
      { name: "Refonte de Site", href: "/services/refonte" }
    ],
    company: [
      { name: "À Propos", href: "/about" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "Process", href: "/process" },
      { name: "Contact", href: "/contact" }
    ],
    legal: [
      { name: "Mentions Légales", href: "/legal" },
      { name: "Politique de Confidentialité", href: "/privacy" },
      { name: "CGV", href: "/terms" },
      { name: "Cookies", href: "/cookies" }
    ]
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,162,158,.02)_50%,transparent_75%,transparent_100%)]"></div>
      
      {/* Simplified Footer: minimal content as requested */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 text-center">
        <div className="text-gray-400 text-sm">
          © {currentYear} Optivise. Tous droits réservés.
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, -50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
