import ProduitPageClient from "./ProduitPageClient";

interface ProduitPageProps {
  params: {
    id: string;
  };
}

export default function ProduitPage({ params }: ProduitPageProps) {
  return <ProduitPageClient produitId={params.id} />;
} 