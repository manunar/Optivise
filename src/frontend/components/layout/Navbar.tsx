"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/frontend/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/frontend/components/ui/navigation-menu";
import { Menu, DollarSign } from "lucide-react";
import ClientAuthButton from "@/frontend/components/auth/ClientAuthButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '/home' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/services' },
    { name: 'Configurateur', href: '/configurateur' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full top-0 z-50"
    >
      <nav className="backdrop-blur-xl bg-slate-900/20 border-b border-amber-400/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          
          {/* Navigation à gauche d'Optivise */}
          <div className="absolute left-0 hidden lg:flex -translate-x-32">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-8">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link 
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors relative group font-medium"
                      >
                        {item.name}
                        <motion.div
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Logo centré avec $ premium */}
          <Link href="/home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
            {/* Icône $ stylisée premium */}
            <motion.div 
              className="relative w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-2xl shadow-amber-500/30"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(245, 158, 11, 0.3)",
                  "0 0 40px rgba(245, 158, 11, 0.5)",
                  "0 0 20px rgba(245, 158, 11, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <DollarSign className="w-7 h-7 text-black font-bold" />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl opacity-0"
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Nom de la marque premium */}
            <motion.span
              className="font-black text-3xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Optivise
            </motion.span>
            </motion.div>
          </Link>

          {/* Bouton connexion client - Desktop */}
          <div className="absolute right-0 hidden lg:flex translate-x-32">
            <ClientAuthButton variant="desktop" />
          </div>

          {/* Menu mobile */}
          <div className="lg:hidden absolute right-6">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-background/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-background/95 backdrop-blur-md border-border/20 text-foreground w-80"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu de navigation</SheetTitle>
                  <SheetDescription>
                    Accédez aux différentes sections du site Optivise
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Logo mobile */}
                  <div className="flex items-center space-x-3 justify-center mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-bold text-2xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                      Optivise
                    </span>
                  </div>

                  {/* Navigation mobile */}
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block text-lg text-foreground/90 hover:text-foreground hover:bg-background/10 px-4 py-3 rounded-lg transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Séparateur */}
                  <div className="border-t border-border/20 my-4"></div>

                  {/* Bouton connexion client - Mobile */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navItems.length * 0.1 }}
                  >
                    <ClientAuthButton 
                      variant="mobile" 
                      onMobileMenuClose={() => setIsMenuOpen(false)} 
                    />
                  </motion.div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;