import { Metadata } from 'next';
import AuditRefonteFormWithAuth from "@/frontend/components/pages/AuditRefonteFormWithAuth";

export const metadata: Metadata = {
  title: 'Audit Gratuit de Site Web | WebCraft',
  description: 'Obtenez un audit gratuit de 30 minutes pour votre site web existant. Identifiez les problèmes et recevez des recommandations personnalisées pour améliorer votre présence en ligne.',
  keywords: 'audit site web, analyse site internet, refonte site web, amélioration site, diagnostic site web',
};

export default function AuditPage() {
  return <AuditRefonteFormWithAuth />;
}
