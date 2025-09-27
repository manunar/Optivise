import { Metadata } from 'next';
import { ConfirmationPage } from '@/frontend/components';

export const metadata: Metadata = {
  title: 'Confirmation | Optivise',
  description: 'Votre demande a été envoyée avec succès.',
};

export default function Confirmation() {
  return <ConfirmationPage />;
}
