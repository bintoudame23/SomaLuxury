"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProduct } from "@/lib/addProductClient";
import { useCart } from "@/context/CartContext";

/* ✅ image obligatoire */
interface Produit {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const ChaussuresPage: React.FC = () => {
  const { addToCart } = useCart();
  const [produitsChaussures, setProduitsChaussures] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ===================== FETCH ===================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res
          .filter(
            (p: any) =>
              p.categorie?.toLowerCase() === "chaussure" ||
              p.categorie?.toLowerCase() === "mode chaussure"
          )
          .map((p: any) => ({
            id: p.$id,
            name: p.nom_produit ?? "Produit sans nom",
            price: p.prix ?? 0,
            description: p.description ?? "",
            /* ✅ TOUJOURS une string */
            image: p.images?.[0]
              ? mediaUrl(p.images[0])
              : "/default.jpg",
            category: p.categorie ?? "",
          }));

        setProduitsChaussures(formatted);
      } catch (err) {
        console.error("Erreur chargement chaussures :", err);
      }
    };

    loadProducts();
  }, []);

  /* ===================== FILTRAGE ===================== */
  const produitsFiltres = produitsChaussures.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-black text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Chaussures 👟</h1>
        <p className="text-lg opacity-90">
          Style, confort et élégance pour vos pieds
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-6">

        {/* SEARCH */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Rechercher une chaussure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* PRODUITS */}
        {produitsFiltres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {produitsFiltres.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <Link href={`/boutique/produit/${p.id}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <div className="p-5 flex flex-col items-center text-center flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{p.name}</h3>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {p.description || "Aucune description disponible."}
                  </p>

                  <p className="text-gray-800 font-bold mb-4">
                    {p.price.toLocaleString()} FCFA
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image: p.image, // ✅ safe
                      });

                      alert(`🛒 ${p.name} ajouté au panier !`);
                    }}
                    className="mt-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition cursor-pointer active:scale-95"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-20 text-lg">
            Aucun produit trouvé pour "{searchTerm}".
          </p>
        )}
      </main>

      <footer className="bg-black text-white py-6 text-center">
        © {new Date().getFullYear()} Soma Luxury
      </footer>
    </div>
  );
};

export default ChaussuresPage;