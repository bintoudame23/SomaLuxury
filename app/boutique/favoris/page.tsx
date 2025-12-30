"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number | string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    if (fav) setFavorites(JSON.parse(fav));

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeFavorite = (id: number | string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      const updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    alert("Produit ajouté au panier !");
  };

  return (
    <div className="min-h-screen px-6 md:px-20 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">❤️ Vos Favoris</h1>

      {favorites.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-6">
            Vous n’avez aucun article dans vos favoris.
          </p>

          <Link
            href="/boutique/dashboard"
            className="px-6 py-3 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700"
          >
            Voir les produits
          </Link>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition border relative cursor-pointer"
          >
            {/* Toute la carte est cliquable */}
            <Link
              href={`/boutique/produit/${product.id}`}
              className="absolute inset-0 z-0"
            />

            {/* Contenu au-dessus du lien */}
            <div className="relative z-10">
              {/* Image cliquable */}
              <Link href={`/boutique/produit/${product.id}`}>
                <img
                  src={product.image}
                  className="w-full h-56 object-cover rounded-xl mb-4 border"
                />
              </Link>

              {/* Nom cliquable */}
              <Link href={`/boutique/produit/${product.id}`}>
                <h2 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h2>
              </Link>

              {/* Prix cliquable */}
              <Link href={`/boutique/produit/${product.id}`}>
                <p className="text-pink-600 font-bold mt-1">
                  {product.price.toLocaleString()} FCFA
                </p>
              </Link>

              {/* Boutons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(product.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Retirer
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 text-sm"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Voir le produit */}
              <Link
                href={`/boutique/produit/${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block text-center mt-3 text-gray-600 hover:text-pink-600 text-sm underline"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
