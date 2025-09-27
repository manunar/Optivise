"use client";

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function Turnstile({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal'
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger le script Turnstile
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Nettoyer le script au démontage
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile) {
      // Rendre le widget Turnstile
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onSuccess,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme,
        size,
      });
    }

    return () => {
      // Nettoyer le widget au démontage
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [isLoaded, siteKey, onSuccess, onError, onExpire, theme, size]);

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
      {!isLoaded && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-slate-400">Chargement du CAPTCHA...</span>
        </div>
      )}
    </div>
  );
}

// Composant simplifié pour les cas où on n'a pas encore de clé Turnstile
export function SimpleCaptcha({
  onSuccess,
  className = ''
}: {
  onSuccess: (token: string) => void;
  className?: string;
}) {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState({ a: 0, b: 0, result: 0 });

  useEffect(() => {
    // Générer une question mathématique simple
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setQuestion({ a, b, result: a + b });
  }, []);

  const handleSubmit = () => {
    if (parseInt(answer) === question.result) {
      // Générer un token simple (en production, utilisez Turnstile)
      const token = `simple_captcha_${Date.now()}_${Math.random()}`;
      onSuccess(token);
    } else {
      alert('Réponse incorrecte. Veuillez réessayer.');
      setAnswer('');
      // Générer une nouvelle question
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setQuestion({ a, b, result: a + b });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-300 text-sm mb-3">
          Vérification anti-spam : Combien font {question.a} + {question.b} ?
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Votre réponse"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            Vérifier
          </button>
        </div>
      </div>
    </div>
  );
}
