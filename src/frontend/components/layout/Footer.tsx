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
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Logo et Description */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <DollarSign className="w-7 h-7 text-black font-bold" />
                </div>
                <span className="font-black text-3xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Optivise
                </span>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Développement web premium pour entreprises exigeantes. 
                Performance, design et conversion au service de votre croissance.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>contact@optivise.fr</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>Paris, France</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Lun-Ven 9h-18h</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Entreprise */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Entreprise</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* CTA et Newsletter */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Démarrer un Projet</h3>
              <p className="text-gray-400 mb-6">
                Prêt à transformer votre présence en ligne ?
              </p>
              
              <Link href="/configurateur">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 mb-6 w-full"
                >
                  Devis Gratuit
                </Button>
              </Link>
              
              <div className="text-sm text-gray-500">
                <p>✅ Configuration en 2 min</p>
                <p>✅ Réponse sous 24h</p>
                <p>✅ Sans engagement</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm"
          >
            © {currentYear} Optivise. Tous droits réservés. Développement web premium.
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-6"
          >
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Haut de page
            </Button>
          </motion.div>
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
