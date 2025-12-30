import ProduitPageClient from "./ProduitPageClient";

interface ProduitPageProps {
  params: Promise<{ id: string }>;
}


export default async function ProduitPage({ params }: ProduitPageProps) {
  const { id: produitId } = await params; 
  return <ProduitPageClient produitId={produitId} />;
}
