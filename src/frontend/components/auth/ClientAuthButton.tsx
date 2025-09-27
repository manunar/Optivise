'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';
import { 
  User, 
  LogIn, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';
// Import temporairement commenté - nécessite @radix-ui/react-dropdown-menu
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/frontend/components/ui/dropdown-menu';
import { useClientAuthContext } from '@/frontend/contexts/ClientAuthContext';

interface ClientAuthButtonProps {
  variant?: 'desktop' | 'mobile';
  onMobileMenuClose?: () => void;
}

export default function ClientAuthButton({ 
  variant = 'desktop', 
  onMobileMenuClose 
}: ClientAuthButtonProps) {
  // Gestion d'erreur pour le contexte
  let client, loading, signOut, isAuthenticated;
  
  try {
    const authContext = useClientAuthContext();
    client = authContext.client;
    loading = authContext.loading;
    signOut = authContext.signOut;
    isAuthenticated = authContext.isAuthenticated;
  } catch (error) {
    console.warn('ClientAuthContext non disponible, utilisation du fallback');
    // Fallback sans authentification
    client = null;
    loading = false;
    signOut = async () => {};
    isAuthenticated = false;
  }

  const handleSignOut = async () => {
    await signOut();
    if (onMobileMenuClose) onMobileMenuClose();
  };

  const handleMenuClick = () => {
    if (onMobileMenuClose) onMobileMenuClose();
  };

  if (loading) {
    return (
      <div className={`${variant === 'mobile' ? 'w-full' : ''}`}>
        <div className={`
          ${variant === 'mobile' ? 'h-10 w-full' : 'h-9 w-32'} 
          bg-slate-700 animate-pulse rounded-md
        `} />
      </div>
    );
  }

  // Version mobile
  if (variant === 'mobile') {
    if (isAuthenticated && client) {
      return (
        <div className="space-y-3">
          {/* Info utilisateur */}
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-400/20">
            <p className="text-amber-400 font-medium text-sm">
              {client.prenom} {client.nom}
            </p>
            <p className="text-amber-300/70 text-xs">
              {client.entreprise}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
              onClick={handleMenuClick}
            >
              <Link href="/client/dashboard">
                <User className="w-4 h-4 mr-2" />
                Mon espace
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
              onClick={handleMenuClick}
            >
              <Link href="/client/profile">
                <Settings className="w-4 h-4 mr-2" />
                Mon profil
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start text-red-400 border-red-400/30 hover:bg-red-400/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      );
    }

    // Non connecté - mobile
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

  // Version desktop - Version simplifiée sans dropdown pour l'instant
  if (isAuthenticated && client) {
    return (
      <div className="flex items-center space-x-2">
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
            <Link href="/client/dashboard">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden xl:inline">{client.prenom}</span>
              <span className="xl:hidden">Espace</span>
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-400 transition-all duration-300"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // Non connecté - desktop
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
