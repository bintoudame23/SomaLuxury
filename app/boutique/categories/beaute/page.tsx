"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProduct } from "@/lib/addProductClient";
import { useCart } from "@/context/CartContext";

interface Produit {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const Beaute: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "default" | "priceAsc" | "priceDesc" | "alpha"
  >("default");

  const { addToCart } = useCart();

  /* ===================== FETCH APPWRITE ===================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res
          .filter(
            (p: any) =>
              p.categorie?.toLowerCase() === "beaut" ||
              p.categorie?.toLowerCase() === "beaute"
          )
          .map((p: any) => ({
            id: p.$id,
            name: p.nom_produit ?? "Produit sans nom",
            price: p.prix ?? 0,
            image: p.images?.[0]
              ? mediaUrl(p.images[0])
              : "/default.jpg",
            category: p.categorie ?? "",
          }));

        setProduits(formatted);
      } catch (err) {
        console.error("Erreur produits beauté :", err);
      }
    };

    loadProducts();
  }, []);

  /* ===================== FILTRAGE ===================== */
  let produitsFiltres = produits.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  switch (filter) {
    case "priceAsc":
      produitsFiltres.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      produitsFiltres.sort((a, b) => b.price - a.price);
      break;
    case "alpha":
      produitsFiltres.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-black text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">
          Beauté & Soins
        </h1>
        <p className="text-lg text-gray-300">
          Sublimez votre peau avec notre sélection premium
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* FILTRES */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-md p-6">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border mb-6 focus:ring-2 focus:ring-pink-500"
            />

            <h3 className="font-semibold mb-3">Trier par</h3>

            {[
              ["default", "Par défaut"],
              ["alpha", "A → Z"],
              ["priceAsc", "Prix croissant"],
              ["priceDesc", "Prix décroissant"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${
                  filter === key
                    ? "bg-black text-white"
                    : "hover:bg-pink-50"
                }`}
              >
                {label}
              </button>
            ))}
          </aside>

          {/* PRODUITS */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                >
                  {/* IMAGE + LINK */}
                  <Link href={`/boutique/produit/${p.id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-64 w-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      
                    </div>
                  </Link>

                  {/* INFOS */}
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-lg mb-2">
                      {p.name}
                    </h3>
                    
                    <p className="text-lg font-bold mb-4">
                      {p.price.toLocaleString()} FCFA
                    </p>

                <button
  onClick={(e) => {
    e.stopPropagation();

    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
    });

    alert(`🛒 ${p.name} ajouté au panier !`);
  }}
  className="w-full bg-pink-600 hover:bg-pink-700 active:scale-95 
             text-white py-2 rounded-full font-semibold transition
             cursor-pointer"
>
  Ajouter au panier
</button>

                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                Aucun produit beauté trouvé.
              </p>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-black text-white text-center py-6">
        © {new Date().getFullYear()} Soma Luxury
      </footer>
    </div>
  );
};

export default Beaute;
