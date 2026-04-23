"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { fetchProduct } from "@/lib/addProductClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  /* 🔥 CHARGE PRODUITS DEPUIS APPWRITE */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProduct();

        const formatted = res.map((p: any) => ({
          id: p.$id,
          name: p.nom_produit,
          price: p.prix,
          image: p.images?.[0]
            ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${p.images[0]}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
            : "/default.jpg",
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Erreur produits:", err);
      }
    };

    load();
  }, []);

  /* 🔥 CART / FAVORITES */
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  /* 🔥 SEARCH LIVE */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filtered);
  }, [searchTerm, products]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const categories = [
    { href: "/boutique/categories/beaute", label: "Beauté" },
    { href: "/boutique/categories/bijoux", label: "Bijoux" },
    { href: "/boutique/categories/mode", label: "Mode" },
    { href: "/boutique/categories/parfumerie", label: "Parfumerie" },
    { href: "/boutique/categories/vetements", label: "Vêtements" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <Link href="/boutique/dashboard">
            <img src="/somaluxury.png" className="h-14" />
          </Link>

          {/* MENU */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {categories.map((c) => (
              <Link key={c.href} href={c.href}>
                {c.label}
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div className="hidden sm:flex flex-1 justify-center">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full max-w-md border rounded-full px-4 py-2 text-sm"
            />
          </div>

          {/* ICONS */}
          <div className="flex gap-3">

            <button onClick={() => router.push("/boutique/favoris")}>
              ❤️ {favorites.length}
            </button>

            <button onClick={() => router.push("/boutique/panier")}>
              🛒 {totalItems}
            </button>

            {/* 🔥 SUPPORT AJOUTÉ */}
            <button onClick={() => router.push("/boutique/support")}>
              💬
            </button>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>

          </div>
        </div>
      </header>

      {/* SEARCH RESULTS */}
      {searchTerm && (
        <div className="absolute w-full bg-white shadow-lg z-50 max-h-96 overflow-y-auto">

          {results.length > 0 ? (
            results.map((p) => (
              <Link
                key={p.id}
                href={`/boutique/produit/${p.id}`}
                onClick={() => setSearchTerm("")}
                className="flex gap-3 p-3 border-b hover:bg-pink-50"
              >
                <img src={p.image} className="w-12 h-12 rounded" />
                <div>
                  <p>{p.name}</p>
                  <p className="text-sm text-gray-500">
                    {p.price.toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-center text-gray-400">
              Aucun produit trouvé
            </p>
          )}
        </div>
      )}
    </>
  );
}