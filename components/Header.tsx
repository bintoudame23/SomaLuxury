"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProduct } from "@/lib/addProductClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function Header() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const categories = [
    { href: "/boutique/categories/beaute", label: "Beauté" },
    { href: "/boutique/categories/bijoux", label: "Bijoux" },
    { href: "/boutique/categories/mode", label: "Mode" },
    { href: "/boutique/categories/parfumerie", label: "Parfumerie" },
    { href: "/boutique/categories/vetements", label: "Vêtements" },
  ];

  /* PRODUCTS */
  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, []);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) return setResults([]);

    setResults(
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/boutique/dashboard">
            <img src="/somaluxury.png" className="h-12" />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {categories.map((c) => (
              <Link key={c.href} href={c.href}>
                {c.label}
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div className="hidden sm:flex flex-1 justify-center px-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full max-w-md border rounded-full px-4 py-2 text-sm"
            />
          </div>

          {/* ICONS */}
          <div className="flex gap-3 items-center">

            <button onClick={() => router.push("/boutique/favoris")}>
              ❤️ {favorites.length}
            </button>

            <button onClick={() => router.push("/boutique/panier")}>
              🛒 {totalItems}
            </button>

            <button onClick={() => router.push("/boutique/support")}>
              💬
            </button>

            {/* 🔥 PROFIL AJOUTÉ */}
            <button onClick={() => router.push("/components/login-form")}>
              👤
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* 🔥 MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-3">

            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="block py-2 border-b"
                onClick={() => setMenuOpen(false)}
              >
                {c.label}
              </Link>
            ))}

            {/* 🔥 PROFIL MOBILE */}
            <button
              onClick={() => {
                router.push("/boutique/profil");
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b"
            >
              👤 Profil
            </button>

          </div>
        )}
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