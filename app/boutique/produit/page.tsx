"use client";

import {produits} from "@/lib/products";
import React, { useEffect, useState } from "react";
import { fetchProduct } from "@/lib/addProductClient";

interface Category {
  $id: string;
  nom_categorie: string;
}

interface Product {
  $id: string;
  nom_produit: string;
  description?: string;
  prix: number;
  images?: string[];
  quantite?: number;
  categorie: Category;
  videos?: string[];
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const ProduitPageClient: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);


  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProduct();
      setProducts(data);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (produit: Product) => {
    const existing = cart.find((p: any) => p.$id === produit.$id);

    if (existing) {
      setCart(
        cart.map((p: any) =>
          p.$id === produit.$id
            ? { ...p, quantitePanier: (p.quantitePanier ?? 1) + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...produit, quantitePanier: 1 }]);
    }

    alert(`${produit.nom_produit} ajouté au panier !`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Nos Produits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.$id}
            className="border rounded-xl shadow p-4 space-y-3"
          >
            {product.images?.length ? (
              <img
                src={mediaUrl(product.images[0])}
                alt={product.nom_produit}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center rounded">
                Aucune image
              </div>
            )}

            <h2 className="text-xl font-bold">{product.nom_produit}</h2>

            <p className="text-gray-600 text-sm">
              {product.description || "Aucune description"}
            </p>

            <p className="text-sm">
              🗂 Catégorie : {product.categorie?.nom_categorie || "Non définie"}
            </p>

            <p className="font-semibold">💰 {product.prix.toLocaleString()} FCFA</p>

            <p className="text-sm">📦 Stock : {product.quantite ?? 0}</p>

            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-gray-800 hover:bg-pink-600 text-white py-2 rounded-full transition"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProduitPageClient;
