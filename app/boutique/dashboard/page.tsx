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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
        Nouveaux Produits
      </h2>

      {/* GRID RESPONSIVE */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">

        {produitsData.map((produit) => (
          <div
            key={produit.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >

            {/* IMAGE + FAVORI */}
            <div className="relative">

              <button
                className="absolute top-2 right-2 text-pink-600 text-lg sm:text-xl bg-white/80 rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();

                  toggleFavorite({
                    id: produit.id,
                    name: produit.name,
                    image: produit.image,
                    price: produit.price,
                  });
                }}
              >
                {isFavorite(produit.id) ? <FaHeart /> : <FaRegHeart />}
              </button>

              <Link href={`/boutique/produit/${produit.id}`}>
                <img
                  src={produit.image}
                  alt={produit.name}
                  className="h-32 sm:h-48 lg:h-56 w-full object-cover"
                />
              </Link>

            </div>

            {/* CONTENT */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">

              <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                {produit.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                {produit.description}
              </p>

              <p className="font-bold mt-2 text-sm sm:text-base">
                {produit.price.toLocaleString()} FCFA
              </p>

              {/* BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  addToCart({
                    id: produit.id,
                    name: produit.name,
                    price: produit.price,
                    image: produit.image,
                  });

                  alert(`${produit.name} ajouté au panier`);
                }}
                className="mt-auto w-full bg-pink-600 hover:bg-pink-700 text-white py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition"
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