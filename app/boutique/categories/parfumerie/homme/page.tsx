"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Produit {
  id?: number;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

const HommePage: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Charger les produits depuis l'API
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products"); 
        if (!res.ok) throw new Error("Impossible de récupérer les produits");

        const data: Produit[] = await res.json();

        const hommes = data.filter(
          (produit) => produit.category?.toLowerCase() === "hommes"
        );

        setProduits(hommes);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };

    fetchProduits();
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

  // 🔹 Filtrage des produits selon le terme de recherche
  const produitsFiltres = produits.filter((produit) =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <main className="flex-grow max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Parfums Homme
        </h1>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        {produitsFiltres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {produitsFiltres.map((produit) => (
              <div
                key={produit._id || produit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
              >
                <Link href={`/produit/page?id=${produit._id || produit.id}`}>
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
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-5 rounded-full transition"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-20 text-lg">
            Aucun produit homme disponible pour le moment.
          </p>
        )}
      </main>

      <footer className="bg-black text-white py-4 mt-20 text-center">
        <p>© {new Date().getFullYear()} Soma Luxury. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HommePage;
