'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuditRefonteForm, ClientChoiceModal } from '@/frontend/components';
// Type pour le choix utilisateur
interface ChoixUtilisateur {
  mode: 'invite' | 'connexion' | 'inscription';
  email?: string;
  nom?: string;
  prenom?: string;
  entreprise?: string;
}

interface AuditRefonteFormWithAuthProps {
  onBack?: () => void;
}

export default function AuditRefonteFormWithAuth({ onBack }: AuditRefonteFormWithAuthProps) {
  const [showClientChoice, setShowClientChoice] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Intercepter la soumission du formulaire d'audit
  const handleAuditSubmit = async (auditData: any) => {
    // Au lieu d'envoyer directement, stocker et afficher le choix client
    setPendingSubmission(auditData);
    setShowClientChoice(true);
  };

  const handleClientChoice = async (choice: ChoixUtilisateur) => {
    if (!pendingSubmission) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let finalData = { 
        ...pendingSubmission,
        // Mapper les champs pour correspondre à l'API
        url_site_actuel: pendingSubmission.url_site,
        problemes_identifies: pendingSubmission.problemes_rencontres || [],
        problemes_personnalises: [],
        objectifs_souhaites: pendingSubmission.objectifs_principaux || [],
        objectifs_personnalises: []
      };
      
      // Si l'utilisateur choisit de créer un compte ou se connecter
      if (choice.mode !== 'invite') {
        finalData.client_mode = choice.mode;
        finalData.client_data = {
          email: choice.email,
          nom: choice.nom,
          prenom: choice.prenom,
          entreprise: choice.entreprise
        };
      }

      const response = await fetch('/api/contact/audit-refonte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Rediriger selon le choix
        if (choice.mode === 'inscription') {
          router.push(`/client/register?email=${encodeURIComponent(choice.email || '')}&redirect=/client/dashboard`);
        } else if (choice.mode === 'connexion') {
          router.push(`/client/login?email=${encodeURIComponent(choice.email || '')}&redirect=/client/dashboard`);
        } else {
          // Mode invité - page de confirmation classique
          router.push(`/confirmation?id=${result.demande_id}&type=audit`);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
      setPendingSubmission(null);
    }
  };

  return (
    <>
      <AuditRefonteForm 
        onBack={onBack}
        onSubmit={handleAuditSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
      
      {/* Modal de choix client */}
      <ClientChoiceModal
        isOpen={showClientChoice}
        onClose={() => {
          setShowClientChoice(false);
          setPendingSubmission(null);
        }}
        onChoice={handleClientChoice}
        userEmail={pendingSubmission?.email}
        userName={pendingSubmission ? `${pendingSubmission.prenom} ${pendingSubmission.nom}` : undefined}
        userCompany={pendingSubmission?.entreprise}
      />
    </>
  );
}
