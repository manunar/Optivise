'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { User, LogIn } from 'lucide-react';

interface SimpleClientAuthButtonProps {
  variant?: 'desktop' | 'mobile';
  onMobileMenuClose?: () => void;
}

// Version simplifiée sans contexte d'authentification pour éviter les erreurs
export default function SimpleClientAuthButton({ 
  variant = 'desktop', 
  onMobileMenuClose 
}: SimpleClientAuthButtonProps) {
  
  const handleMenuClick = () => {
    if (onMobileMenuClose) onMobileMenuClose();
  };

  // Version mobile
  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-medium"
          onClick={handleMenuClick}
        >
          <Link href="/client/login" className="flex items-center justify-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>Se connecter</span>
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="w-full"
          onClick={handleMenuClick}
        >
          <Link href="/client/register" className="flex items-center justify-center space-x-2">
            <User className="w-4 h-4" />
            <span>Créer un compte</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Version desktop - Non connecté
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-amber-400 transition-all duration-300"
        >
          <Link href="/client/login">
            <LogIn className="w-4 h-4 mr-2" />
            <span className="hidden xl:inline">Se connecter</span>
            <span className="xl:hidden">Connexion</span>
          </Link>
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 transition-all duration-300"
        >
          <Link href="/client/register">
            <User className="w-4 h-4 mr-2" />
            <span className="hidden xl:inline">Créer un compte</span>
            <span className="xl:hidden">Inscription</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
