"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import { fetchProduct } from "@/lib/addProductClient";
import { useCart } from "@/context/CartContext";

/* ✅ image obligatoire */
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

          /* ✅ toujours string */
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
    <main className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-3xl font-bold text-center mb-12">
        Nouveaux Produits
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {produitsData.map((produit) => (
          <div
            key={produit.id}
            className="bg-white rounded-2xl shadow-lg relative overflow-hidden"
          >

            {/* ❤️ FAVORI */}
            <button
              className="absolute top-4 right-4 text-pink-600 text-xl"
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

            {/* PRODUIT */}
            <Link href={`/boutique/produit/${produit.id}`}>
              <div className="p-5 cursor-pointer">

                <img
                  src={produit.image}
                  alt={produit.name}
                  className="h-60 w-full object-cover rounded-xl mb-4"
                />

                <h3 className="font-semibold">{produit.name}</h3>

                <p className="text-sm text-gray-500">
                  {produit.description.slice(0, 60)}...
                </p>

                <p className="font-bold mt-2">
                  {produit.price.toLocaleString()} FCFA
                </p>

              </div>
            </Link>

            {/* CART */}
            <div className="p-5 pt-0">

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  addToCart({
                    id: produit.id,
                    name: produit.name,
                    price: produit.price,
                    image: produit.image, // ✅ safe
                  });

                  alert(`${produit.name} ajouté au panier`);
                }}
                className="w-full bg-pink-600 text-white py-2 rounded-full"
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