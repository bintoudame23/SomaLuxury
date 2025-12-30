"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Product {
  id: number | string;
  name: string;
  price: number;
  image?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("allProducts");
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const c = localStorage.getItem("cart");
    const f = localStorage.getItem("favorites");

    if (c) setCart(JSON.parse(c));
    if (f) setFavorites(JSON.parse(f));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* HEADER */}
      <header className="w-full px-8 py-4 bg-white/70 backdrop-blur-md shadow-md flex justify-between items-center sticky top-0 z-50 border-b">

        {/* LOGO agrandi + espacé */}
        <Link href="/boutique/dashboard">
          <img
            src="/somaluxury.png"
            className="h-20 object-contain cursor-pointer mr-10"
          />
        </Link>

        {/* MENU plus espacé */}
        <nav className="hidden md:flex gap-10 font-medium text-[15px]">

          {[
            { href: "/boutique/categories/beaute", label: "Beauté" },
            { href: "/boutique/categories/bijoux", label: "Bijoux & Accessoires" },
            { href: "/boutique/categories/mode", label: "Mode" },
            { href: "/boutique/categories/parfumerie", label: "Parfumerie" },
            { href: "/boutique/categories/vetements", label: "Vêtements" },
        
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-pink-600 transition ${
                pathname === item.href || pathname.startsWith(item.href)
                  ? "text-pink-600 font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

        </nav>

        {/* Search bar réduite */}
        <div className="flex-1 flex justify-center px-6">
          <div className="relative w-[250px]"> {/* 🔥 Réduction ici */}
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Recherche..."
              className="w-full rounded-full px-4 py-2 border shadow-sm focus:ring-2 focus:ring-pink-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* ICONES */}
        <div className="flex items-center gap-4">

          {/* Favoris */}
          <button
            onClick={() => router.push("/boutique/favoris")}
            className="w-10 h-10 rounded-full border flex items-center justify-center relative hover:text-pink-600 hover:border-pink-600"
          >
            <i className="ri-heart-line text-xl" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Panier */}
          <button
            onClick={() => router.push("/boutique/panier")}
            className="w-10 h-10 rounded-full border flex items-center justify-center relative hover:text-pink-600 hover:border-pink-600"
          >
            <i className="ri-shopping-cart-line text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Contact */}
          <button
            onClick={() => router.push("/boutique/support")}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-pink-600 hover:border-pink-600"
          >
            <i className="ri-message-3-line text-xl" />
          </button>
        </div>
      </header>

      {/* SEARCH RESULTS */}
      {searchTerm.length > 0 && (
        <div className="absolute left-0 w-full bg-white shadow-lg max-h-80 overflow-y-auto z-40 p-4 border-t">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <Link
                key={p.id}
                href={`/boutique/produit/${p.id}`}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl hover:bg-pink-50 border mb-2"
              >
                <img
                  src={p.image}
                  className="w-12 h-12 rounded-lg border object-cover"
                />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-600">
                    {p.price.toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </>
  );
}
