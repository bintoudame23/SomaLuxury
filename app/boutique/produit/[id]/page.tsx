import ProduitPageClient from "./ProduitPageClient";

interface ProduitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProduitPage({ params }: ProduitPageProps) {
  const { id } = await params; // ✅ IMPORTANT

  return <ProduitPageClient produitId={id} />;
}