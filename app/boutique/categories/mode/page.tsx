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
  subCategorie?: string[];
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const Mode: React.FC = () => {
  const { addToCart } = useCart();

  const [produitsMode, setProduitsMode] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "default" | "priceAsc" | "priceDesc" | "alpha"
  >("default");

  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

  /* ===================== FETCH ===================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res
          .filter((p: any) => p.categorie?.toLowerCase() === "mode")
          .map((p: any) => ({
            id: p.$id,
            name: p.nom_produit ?? "Produit sans nom",
            price: p.prix ?? 0,
            description: p.description ?? "",
            /* ✅ TOUJOURS string */
            image: p.images?.[0]
              ? mediaUrl(p.images[0])
              : "/default.jpg",
            category: p.categorie ?? "",
            subCategorie: (p.subCategorie || []).map((sc: string) =>
              sc.toLowerCase()
            ),
          }));

        setProduitsMode(formatted);

        const allSubCategories = Array.from(
          new Set(formatted.flatMap((p) => p.subCategorie || []))
        );

        setAvailableSubCategories(allSubCategories);
      } catch (err) {
        console.error("Erreur chargement produits mode :", err);
      }
    };

    loadProducts();
  }, []);

  /* ===================== FILTRAGE ===================== */
  const produitsFiltres = produitsMode
    .filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSub =
        subCategoryFilter === "all" ||
        p.subCategorie?.includes(subCategoryFilter);

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

  /* ✅ typage clean */
  const filterOptions = [
    ["default", "Par défaut"],
    ["alpha", "A-Z"],
    ["priceAsc", "Prix croissant"],
    ["priceDesc", "Prix décroissant"],
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-black text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Mode</h1>
        <p className="text-lg opacity-90">
          Découvrez nos vêtements et accessoires tendance
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-6">

        {/* SEARCH */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* FILTRES */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setSubCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg text-left ${
                  subCategoryFilter === "all"
                    ? "bg-gray-800 text-white"
                    : "hover:bg-pink-50"
                }`}
              >
                Tous
              </button>

              {availableSubCategories.map((sc) => (
                <button
                  key={sc}
                  onClick={() => setSubCategoryFilter(sc)}
                  className={`px-4 py-2 rounded-lg text-left ${
                    subCategoryFilter === sc
                      ? "bg-gray-800 text-white"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {sc.charAt(0).toUpperCase() + sc.slice(1)}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4">Trier</h2>

            <div className="flex flex-col gap-3">
              {filterOptions.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-left ${
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

          {/* PRODUITS */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition flex flex-col"
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

                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {p.description || "Aucune description disponible."}
                    </p>

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
                          image: p.image, // ✅ safe
                        });

                        alert(`🛒 ${p.name} ajouté au panier !`);
                      }}
                      className="mt-auto bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-20 col-span-full">
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

export default Mode;