"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { produits } from "@/lib/products"; // <-- ton fichier local
import { Produit } from "@/lib/types";     // <-- ton type

const bougies: React.FC = () => {
  const [produitsBeaute, setProduitsBeaute] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Produit[]>([]);

  // 🔹 Filtrer les produits de la catégorie "bougies"
 useEffect(() => {
  const bougies = produits.filter(produit => produit.category === "bougies");
  setProduitsBeaute(bougies);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <main className="flex-grow max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Beauté
        </h1>

        {produitsBeaute.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {produitsBeaute.map((produit) => (
              <div
                key={produit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <Link href={`/boutique/produit/${produit.id}`}>
                  <img
                    src={produit.image || "/default.jpg"}
                    alt={produit.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <div className="p-5 flex flex-col items-center text-center">
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
          <p className="text-gray-500 text-center col-span-full">
            Aucun produit disponible pour le moment.
          </p>
        )}
      </main>

      <footer className="bg-black text-white py-4 mt-20 text-center">
        <p>© {new Date().getFullYear()} Soma Luxury. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default bougies;
