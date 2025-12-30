"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { produits } from "@/lib/products";
import { Produit } from "@/lib/types";

const FemmePage: React.FC = () => {
  const [produitsFemme, setProduitsFemme] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");

  // 🔹 Filtrer les produits de la catégorie "femmes"
  useEffect(() => {
    const femmes = produits.filter((produit) => produit.category === "femmes");
    setProduitsFemme(femmes);
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
    setCart((prev) => [...prev, produit]);
    alert(`${produit.name} a été ajouté au panier !`);
  };

  // 🔹 Filtrage dynamique selon le menu déroulant
  const produitsFiltres = produitsFemme
    .filter((produit) =>
      produit.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "prix-bas") return a.price - b.price;
      if (filter === "prix-haut") return b.price - a.price;
      if (filter === "nom-asc") return a.name.localeCompare(b.name);
      if (filter === "nom-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <main className="flex-grow max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Parfums Femme
        </h1>

        {/* Barre de recherche et menu déroulant */}
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-3xl mx-auto mb-10 gap-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 px-6 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          >
            <option value="default">Tout afficher</option>
            <option value="prix-bas">Prix : du plus bas au plus élevé</option>
            <option value="prix-haut">Prix : du plus élevé au plus bas</option>
            <option value="nom-asc">Nom : A → Z</option>
            <option value="nom-desc">Nom : Z → A</option>
          </select>
        </div>

        {produitsFiltres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {produitsFiltres.map((produit) => (
              <div
                key={produit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
              >
                <Link href={`/boutique/produit/${produit.id}`}>
                  <img
                    src={produit.image || "/default.jpg"}
                    alt={produit.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <div className="p-5 flex flex-col items-center text-center flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                    {produit.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                    {produit.description || "Aucune description disponible."}
                  </p>

                  <p className="text-gray-700 mb-4 font-medium">
                    {produit.price.toLocaleString()} FCFA
                  </p>

                  <button
                    onClick={() => handleAddToCart(produit)}
                    className="bg-gray-800 hover:bg-pink-600 text-white font-medium py-2 px-5 rounded-full transition cursor-pointer"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-20 text-lg">
            Aucun produit femme disponible pour le moment.
          </p>
        )}
      </main>

      <footer className="bg-black text-white py-4 mt-20 text-center">
        <p>© {new Date().getFullYear()} Soma Luxury. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default FemmePage;
