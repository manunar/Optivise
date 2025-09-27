'use client';

import { useState } from 'react';
import { Button, Card, Input, Label } from '@/frontend/components';

interface ChoixUtilisateur {
  mode: 'invite' | 'connexion' | 'inscription';
  email?: string;
  nom?: string;
  prenom?: string;
  entreprise?: string;
}

interface ClientChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (choice: ChoixUtilisateur) => void;
  userEmail?: string;
  userName?: string;
  userCompany?: string;
}

export default function ClientChoiceModal({
  isOpen,
  onClose,
  onChoice,
  userEmail = '',
  userName = '',
  userCompany = ''
}: ClientChoiceModalProps) {
  const [selectedMode, setSelectedMode] = useState<'invite' | 'connexion' | 'inscription' | null>(null);
  const [email, setEmail] = useState(userEmail);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [entreprise, setEntreprise] = useState(userCompany);

  // Parse userName if provided
  useState(() => {
    if (userName) {
      const parts = userName.trim().split(' ');
      if (parts.length >= 2) {
        setPrenom(parts[0]);
        setNom(parts.slice(1).join(' '));
      } else if (parts.length === 1) {
        setPrenom(parts[0]);
      }
    }
  });

  const handleSubmit = () => {
    if (!selectedMode) return;

    const choice: ChoixUtilisateur = {
      mode: selectedMode,
      ...(selectedMode !== 'invite' && {
        email,
        nom,
        prenom,
        entreprise
      })
    };

    onChoice(choice);
  };

  const isFormValid = () => {
    if (selectedMode === 'invite') return true;
    return email && nom && prenom;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Finaliser votre demande
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm mb-4">
              Choisissez comment vous souhaitez suivre votre demande d'audit :
            </p>

            {/* Mode Selection */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="invite"
                  checked={selectedMode === 'invite'}
                  onChange={(e) => setSelectedMode(e.target.value as 'invite')}
                  className="text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-white font-medium">Continuer en tant qu'invité</div>
                  <div className="text-gray-400 text-sm">Nous vous contacterons par email</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="connexion"
                  checked={selectedMode === 'connexion'}
                  onChange={(e) => setSelectedMode(e.target.value as 'connexion')}
                  className="text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-white font-medium">Se connecter à mon compte</div>
                  <div className="text-gray-400 text-sm">J'ai déjà un compte client</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="inscription"
                  checked={selectedMode === 'inscription'}
                  onChange={(e) => setSelectedMode(e.target.value as 'inscription')}
                  className="text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-white font-medium">Créer un compte client</div>
                  <div className="text-gray-400 text-sm">Accès à un espace personnel</div>
                </div>
              </label>
            </div>

            {/* Form Fields for Account Creation/Login */}
            {selectedMode && selectedMode !== 'invite' && (
              <div className="mt-6 space-y-4 p-4 bg-gray-800 rounded-lg">
                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="prenom" className="text-white">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Prénom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom" className="text-white">Nom *</Label>
                    <Input
                      id="nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="entreprise" className="text-white">Entreprise</Label>
                  <Input
                    id="entreprise"
                    value={entreprise}
                    onChange={(e) => setEntreprise(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedMode || !isFormValid()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedMode === 'invite' ? 'Envoyer' : 
                 selectedMode === 'connexion' ? 'Se connecter' : 'Créer un compte'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
