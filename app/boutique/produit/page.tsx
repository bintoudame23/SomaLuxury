
"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantité?: number;
  category?: string;
  video?: string;
}

const ProduitPageClient: React.FC<{ product: Product }> = ({ product }) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (produit: Product) => {
    const existing = cart.find((p) => p.id === produit.id);

    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === produit.id ? { ...p, quantité: (p.quantité ?? 1) + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...produit, quantité: 1 }]);
    }

    alert(`${produit.name} ajouté au panier !`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg"
        />
      )}
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-xl text-gray-700 mt-2">
        Prix : {product.price.toLocaleString()} FCFA
      </p>
      <p className="mt-4 text-gray-600">
        Description : {product.description || "Aucune description"}
      </p>
      <p className="mt-2 text-gray-600">
        Quantité disponible : {product.quantité ?? "Non renseignée"}
      </p>
      <button
        onClick={() => handleAddToCart(product)}
        className="bg-gray-800 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-full transition cursor-pointer mt-4"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProduitPageClient;
