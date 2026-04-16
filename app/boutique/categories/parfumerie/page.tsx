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
  description?: string;
  category?: string;
  subCategorie?: string[];
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const Parfumerie: React.FC = () => {
  const { addToCart } = useCart();

  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<
    "default" | "priceAsc" | "priceDesc" | "alpha"
  >("default");

  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [availableSubCategories, setAvailableSubCategories] = useState<
    string[]
  >([]);

  /* ================= FETCH PRODUITS ================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res
          .filter((p: any) => p.categorie?.toLowerCase() === "parfumerie")
          .map((p: any) => ({
            id: p.$id,
            name: p.nom_produit ?? "Produit sans nom",
            price: p.prix ?? 0,
            description: p.description ?? "",
            image: p.images?.[0] ? mediaUrl(p.images[0]) : "/default.jpg",
            category: p.categorie ?? "",
            subCategorie: (p.subCategorie || []).map((sc: string) =>
              sc.toLowerCase()
            ),
          }));

        setProduits(formatted);

        /* EXTRAIRE LES SOUS CATEGORIES */

        const allSubCategories = Array.from(
          new Set(formatted.flatMap((p) => p.subCategorie || []))
        );

        setAvailableSubCategories(allSubCategories);
      } catch (err) {
        console.error("Erreur chargement parfumerie :", err);
      }
    };

    loadProducts();
  }, []);

  /* ================= FILTRAGE ================= */

  const produitsFiltres = produits
    .filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSub =
        subCategoryFilter === "all" ||
        p.subCategorie?.some((sc) => sc === subCategoryFilter);

      return matchesSearch && matchesSub;
    })
    .sort((a, b) => {
      switch (filter) {
        case "priceAsc":
          return a.price - b.price;

        case "priceDesc":
          return b.price - a.price;

        case "alpha":
          return a.name.localeCompare(b.name);

        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
   
      <section className="bg-black text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Parfumerie</h1>
        <p className="text-lg opacity-90">
          Découvrez nos parfums et senteurs exclusives
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-6">
     
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
    
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-md p-6 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setSubCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  subCategoryFilter === "all"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Tous
              </button>

              {availableSubCategories.map((sc) => (
                <button
                  key={sc}
                  onClick={() => setSubCategoryFilter(sc)}
                  className={`px-4 py-2 rounded-lg text-left transition ${
                    subCategoryFilter === sc
                      ? "bg-gray-800 text-white font-semibold"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {sc.charAt(0).toUpperCase() + sc.slice(1)}
                </button>
              ))}
            </div>

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
                      ? "bg-gray-800 text-white font-semibold"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col"
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

                    {/* <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {p.description || "Aucune description disponible."}
                    </p> */}

                    <p className="text-gray-800 font-bold mb-2">
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
                      className="mt-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition cursor-pointer active:scale-95"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-20 text-lg col-span-full">
                Aucun produit trouvé pour "{searchTerm}".
              </p>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-black text-white py-6 text-center">
        © {new Date().getFullYear()} Soma Luxury
      </footer>
    </div>
  );
};

export default Parfumerie;