/**
 * Hook personnalisé pour gérer le cache des options
 * Évite les requêtes répétées à /api/options
 */

import { useState, useEffect, useRef } from 'react';

interface Option {
  id: string;
  nom: string;
  description: string;
  prix_ht: number;
  categorie: string;
  type_option: string;
  obligatoire: boolean;
  actif: boolean;
}

interface OptionsCache {
  data: Option[];
  timestamp: number;
}

// Cache global partagé entre tous les composants
let globalOptionsCache: OptionsCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useOptions() {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchOptions = async () => {
      // Éviter les requêtes multiples simultanées
      if (fetchingRef.current) return;

      // Vérifier le cache d'abord
      if (globalOptionsCache) {
        const now = Date.now();
        if (now - globalOptionsCache.timestamp < CACHE_DURATION) {
          console.log('🎯 Utilisation du cache frontend pour les options');
          setOptions(globalOptionsCache.data);
          setLoading(false);
          return;
        }
      }

      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        console.log('📡 Récupération des options depuis l\'API');
        const response = await fetch('/api/options');
        const result = await response.json();

        if (result.success && result.data) {
          const optionsData = result.data;
          
          // Mettre à jour le cache global
          globalOptionsCache = {
            data: optionsData,
            timestamp: Date.now()
          };

          setOptions(optionsData);
        } else {
          throw new Error(result.error || 'Erreur lors du chargement des options');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des options:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchOptions();
  }, []);

  // Fonction pour forcer le rechargement
  const refetch = () => {
    globalOptionsCache = null;
    setLoading(true);
    setError(null);
  };

  // Fonction pour obtenir des options filtrées
  const getOptionsByType = (type: string) => {
    return options.filter(option => option.type_option === type);
  };

  const getOptionsByCategory = (category: string) => {
    return options.filter(option => option.categorie === category);
  };

  const getObligatoryOptions = () => {
    return options.filter(option => option.obligatoire);
  };

  return {
    options,
    loading,
    error,
    refetch,
    getOptionsByType,
    getOptionsByCategory,
    getObligatoryOptions,
    // Stats utiles
    totalOptions: options.length,
    activeOptions: options.filter(opt => opt.actif).length
  };
}

// Hook spécialisé pour obtenir des options sélectionnées par leurs IDs
export function useSelectedOptions(optionIds: string[]) {
  const { options, loading, error } = useOptions();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!loading && options.length > 0 && optionIds.length > 0) {
      const selected = options.filter(option => optionIds.includes(option.id));
      setSelectedOptions(selected);
    }
  }, [options, loading, optionIds]);

  return {
    selectedOptions,
    loading,
    error,
    totalPrice: selectedOptions.reduce((sum, opt) => sum + opt.prix_ht, 0),
    totalPriceTTC: selectedOptions.reduce((sum, opt) => sum + opt.prix_ht, 0) * 1.2
  };
}
