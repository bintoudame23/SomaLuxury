"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { produits } from "@/lib/products";
import { Produit } from "@/lib/types";

const Mode: React.FC = () => {
  const [produitsMode, setProduitsMode] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"default" | "priceAsc" | "priceDesc" | "alpha">(
    "default"
  );
  const [subCategory, setSubCategory] = useState<"all" | "chaussures" | "sacs">("all");

  // 🔹 Filtrer les produits de la catégorie "mode"
  useEffect(() => {
    const mode = produits.filter(produit => produit.category === "mode");
    setProduitsMode(mode);
  }, []);

  // 🔹 Charger le panier depuis le localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // 🔹 Sauvegarder le panier dans le localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Ajouter un produit au panier
  const handleAddToCart = (produit: Produit) => {
    setCart(prev => [...prev, produit]);
    alert(`${produit.name} a été ajouté au panier !`);
  };

  // 🔹 Filtrage selon le terme de recherche et la sous-catégorie
  let produitsFiltres = produitsMode.filter(produit =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (subCategory === "all" || produit.subCategory === subCategory)
  );

  // 🔹 Appliquer le tri
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto py-16 px-4 lg:px-6">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Mode</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* FILTRE GAUCHE */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-md p-6 flex-shrink-0">
            {/* Barre de recherche compacte */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-full border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setSubCategory("all")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  subCategory === "all"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSubCategory("chaussures")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  subCategory === "chaussures"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Chaussures
              </button>
              <button
                onClick={() => setSubCategory("sacs")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  subCategory === "sacs"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Sacs
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Trier</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setFilter("default")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  filter === "default"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Par défaut
              </button>
              <button
                onClick={() => setFilter("alpha")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  filter === "alpha"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setFilter("priceAsc")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  filter === "priceAsc"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Prix croissant
              </button>
              <button
                onClick={() => setFilter("priceDesc")}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  filter === "priceDesc"
                    ? "bg-gray-800 text-white font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                Prix décroissant
              </button>
            </div>
          </aside>

          {/* LISTE DES PRODUITS */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((produit) => (
                <div
                  key={produit.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  <Link href={`/boutique/produit/${produit.id}`}>
                    <img
                      src={produit.image || "/default.jpg"}
                      alt={produit.name}
                      className="w-full h-64 object-cover rounded-t-2xl"
                    />
                  </Link>

                  <div className="p-4 flex flex-col items-center text-center flex-grow">
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">
                      {produit.name}
                    </h3>

                    <p className="text-gray-700 font-medium mb-3">
                      {produit.price.toLocaleString()} FCFA
                    </p>

                    <button
                      onClick={() => handleAddToCart(produit)}
                      className="bg-gray-800 hover:bg-pink-600 text-white font-medium py-2 px-5 rounded-full transition transform hover:scale-105 text-sm"
                    >
                      Ajouter
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

      {/* FOOTER */}
      <footer className="bg-black text-white py-4 mt-20 text-center">
        <p>© {new Date().getFullYear()} Soma Luxury. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Mode;
