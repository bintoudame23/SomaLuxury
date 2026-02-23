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

const Bijoux: React.FC = () => {
  const { addToCart } = useCart();

  const [produitsBijoux, setProduitsBijoux] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "default" | "priceAsc" | "priceDesc" | "alpha"
  >("default");

  /* ===================== FETCH APPWRITE ===================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res
          .filter(
            (p: any) =>
              p.categorie?.toLowerCase() === "bijoux" ||
              p.categorie?.toLowerCase() === "bijou"
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

        setProduitsBijoux(formatted);
      } catch (err) {
        console.error("Erreur chargement bijoux :", err);
      }
    };

    loadProducts();
  }, []);

  /* ===================== FILTRAGE ===================== */
  let produitsFiltres = produitsBijoux.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* ===================== HERO ===================== */}
      <section className="bg-black text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Bijoux & Accessoires
        </h1>
        <p className="text-lg opacity-90">
          Sublimez votre élégance avec nos pièces d’exception
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===================== FILTRES ===================== */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-md p-6">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-full border mb-6 focus:ring-2 focus:ring-pink-500"
            />

            <h2 className="text-xl font-semibold mb-4">Trier</h2>

            <div className="flex flex-col gap-3">
              {[
                ["default", "Par défaut"],
                ["alpha", "A-Z"],
                ["priceAsc", "Prix croissant"],
                ["priceDesc", "Prix décroissant"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-left transition ${
                    filter === key
                      ? "bg-gray-800 text-white"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* ===================== PRODUITS ===================== */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
                >
                  <Link href={`/boutique/produit/${p.id}`}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-64 w-full object-cover rounded-t-2xl"
                    />
                  </Link>

                  <div className="p-4 text-center flex flex-col gap-2 flex-grow">
                    <h3 className="font-semibold text-lg">{p.name}</h3>

                    <p className="font-bold text-gray-800">
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
                      className="mt-auto w-full bg-pink-600 hover:bg-pink-700
                                 text-white py-2 rounded-full font-semibold
                                 transition cursor-pointer active:scale-95"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 mt-20">
                Aucun bijou trouvé.
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

export default Bijoux;
