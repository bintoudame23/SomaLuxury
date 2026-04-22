"use client";

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
  categorie?: Category;
  videos?: string[];
}

interface CartItem extends Product {
  quantitePanier: number;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const ProduitPageClient: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProduct();

        // 🔥 IMPORTANT : transformation DefaultDocument -> Product
        const formatted: Product[] = (data as any[]).map((p) => ({
          $id: p.$id,
          nom_produit: p.nom_produit ?? "Produit sans nom",
          description: p.description ?? "",
          prix: p.prix ?? 0,
          images: p.images ?? [],
          quantite: p.quantite ?? 0,
          categorie: p.categorie ?? undefined,
          videos: p.videos ?? [],
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Erreur chargement produits :", err);
      }
    };

    loadProducts();
  }, []);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (produit: Product) => {
    const existing = cart.find((p) => p.$id === produit.$id);

    if (existing) {
      setCart(
        cart.map((p) =>
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

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Nos Produits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = product.images?.length
            ? mediaUrl(product.images[0])
            : "/default.jpg";

          return (
            <div
              key={product.$id}
              className="border rounded-xl shadow p-4 space-y-3"
            >
              <img
                src={imageUrl}
                alt={product.nom_produit}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-bold">
                {product.nom_produit}
              </h2>

              <p className="text-gray-600 text-sm">
                {product.description || "Aucune description"}
              </p>

              <p className="text-sm">
                🗂 Catégorie :{" "}
                {product.categorie?.nom_categorie || "Non définie"}
              </p>

              <p className="font-semibold">
                💰 {Number(product.prix || 0).toLocaleString()} FCFA
              </p>

              <p className="text-sm">
                📦 Stock : {product.quantite ?? 0}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gray-800 hover:bg-pink-600 text-white py-2 rounded-full transition"
              >
                Ajouter au panier
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProduitPageClient;