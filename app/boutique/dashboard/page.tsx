"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { produits } from "@/lib/products";
import { useFavorites } from "@/hooks/useFavorites";
import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { useIdeas } from "@/hooks/useIdeas";
import { addProduct, fetchProduct } from "@/lib/productClient";

interface Produit {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity?: number;
  video?: string;
  category?: string;
}

interface Product extends Produit {
  quantity?: number;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [produitsData, setProduitsData] = useState<Produit[]>(produits);
  const [cart, setCart] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [productList, setProductList] = useState<any>([])

  // 🔥 FAVORIS
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (produit: Produit) => {
    const existing = cart.find((p) => p.id === produit.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === produit.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...produit, quantity: 1 }]);
    }
    alert(`${produit.name} a été ajouté au panier !`);
  };

  const produitsFiltresDrawer = produitsData.filter((produit) =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {

    const fetch = async () => {
      const res = await fetchProduct()
      const response = await addProduct()
      console.log(res);
        
      setProductList(res)
    }
    
    fetch()
    
    
    
  }, [])

  console.log(productList);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 font-sans text-gray-800 relative">
      
      {/* ==================== 🔍 DRAWER RECHERCHE ==================== */}
      {showSearch && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-5">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-semibold">Rechercher</h2>
            <button
              onClick={() => setShowSearch(false)}
              className="text-gray-600 hover:text-pink-600 text-2xl cursor-pointer"
            >
              ×
            </button>
          </div>

          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none mt-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="mt-5 max-h-[70vh] overflow-y-auto">
            {produitsFiltresDrawer.length > 0 ? (
              produitsFiltresDrawer.map((produit) => (
                <div
                  key={produit.id}
                  className="flex items-center gap-3 border-b py-4 px-2 hover:bg-gray-50 transition cursor-pointer"
                >
                  <Link
                    href={`/produit/page?id=${produit.id}`}
                    className="flex items-center gap-3 flex-1"
                    onClick={() => setShowSearch(false)}
                  >
                    <img
                      src={produit.image || "/default.jpg"}
                      alt={produit.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />

                    <div>
                      <p className="font-semibold text-gray-800">{produit.name}</p>
                      <p className="text-sm text-gray-500 italic">
                        {(produit.description || "").slice(0, 70)}...
                      </p>
                      <p className="text-sm font-medium">
                        {produit.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </Link>

                  {/* ❤️ AJOUT FAVORIS */}
                  <button
                    className="text-xl text-pink-600"
                    onClick={() =>
                      toggleFavorite({
                        id: produit.id,
                        name: produit.name,
                        image: produit.image,
                        price: produit.price,
                      })
                    }
                  >
                    {isFavorite(produit.id) ? (
                      <FaHeart className="text-pink-600" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">Aucun produit trouvé.</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 bg-black text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Élégance & Raffinement
        </h1>
        <p className="text-lg mb-6 text-gray-200">
          Découvrez nos nouveautés exclusives pour sublimer votre style.
        </p>

        <button
          onClick={() => router.push("/produit")}
          className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white font-semibold shadow-md transition"
        >
          Découvrir nos best sellers
        </button>
      </section>

      {/* ==================== PRODUITS ==================== */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Nouveaux Produits</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {produitsData.map((produit) => (
            <div
              key={produit.id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
            >
              {/* ❤️ FAVORIS EN HAUT À DROITE */}
              <button
                className="absolute top-4 right-4 text-2xl text-pink-600 z-10"
                onClick={() =>
                  toggleFavorite({
                    id: produit.id,
                    name: produit.name,
                    image: produit.image,
                    price: produit.price,
                  })
                }
              >
                {isFavorite(produit.id) ? <FaHeart /> : <FaRegHeart />}
              </button>

              <Link href={`/boutique/produit/${produit.id}`}>
                <div className="p-5 flex flex-col items-center text-center">
                  <img
                    src={produit.image || "/default.jpg"}
                    alt={produit.name}
                    className="w-60 h-70 rounded-lg"
                  />

                  <h3 className="text-lg font-semibold mt-2">{produit.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(produit.description || "").slice(0, 80)}...
                  </p>

                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {produit.price.toLocaleString()} FCFA
                  </p>

                  <button
                    onClick={() => handleAddToCart(produit)}
                    className="bg-black hover:bg-pink-600 text-white font-medium py-2 px-5 rounded-full transition mt-3"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black text-white py-4 mt-20 text-center">
        <p>© {new Date().getFullYear()} Soma Luxury. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Dashboard;






