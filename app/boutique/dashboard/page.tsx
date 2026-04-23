"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import { fetchProduct } from "@/lib/addProductClient";
import { useCart } from "@/context/CartContext";

interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const Dashboard = () => {
  const [produitsData, setProduitsData] = useState<Produit[]>([]);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProduct();

        const formatted: Produit[] = res.map((p: any) => ({
          id: p.$id,
          name: p.nom_produit ?? "Produit sans nom",
          description: p.description ?? "",
          price: p.prix ?? 0,
          image: p.images?.[0]
            ? mediaUrl(p.images[0])
            : "/default.jpg",
          quantity: p.quantite ?? 0,
        }));

        setProduitsData(formatted);
      } catch (err) {
        console.error("Erreur dashboard produits :", err);
      }
    };

    load();
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* TITRE */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
        ✨ Nouveaux Produits
      </h2>

      {/* GRID RESPONSIVE */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">

        {produitsData.map((produit) => (
          <div
            key={produit.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
          >

            {/* IMAGE + FAVORI */}
            <div className="relative">

              <Link href={`/boutique/produit/${produit.id}`}>
                <img
                  src={produit.image}
                  alt={produit.name}
                  className="w-full h-36 sm:h-52 object-cover"
                />
              </Link>

              {/* ❤️ Favori */}
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  toggleFavorite({
                    id: produit.id,
                    name: produit.name,
                    image: produit.image,
                    price: produit.price,
                  });
                }}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow"
              >
                {isFavorite(produit.id) ? (
                  <FaHeart className="text-pink-600" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">

              <Link href={`/boutique/produit/${produit.id}`}>
                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                  {produit.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                  {produit.description}
                </p>

                <p className="font-bold mt-2 text-sm sm:text-base text-gray-900">
                  {produit.price.toLocaleString()} FCFA
                </p>
              </Link>

              {/* BUTTON */}
              <button
                onClick={() =>
                  addToCart({
                    id: produit.id,
                    name: produit.name,
                    price: produit.price,
                    image: produit.image,
                  })
                }
                className="mt-3 w-full bg-pink-600 text-white py-2 rounded-xl text-sm sm:text-base active:scale-95 transition"
              >
                Ajouter au panier
              </button>

            </div>
          </div>
        ))}

      </div>
    </main>
  );
};

export default Dashboard;