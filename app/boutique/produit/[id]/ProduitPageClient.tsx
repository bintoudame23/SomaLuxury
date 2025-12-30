"use client";

import React, { useState, useEffect } from "react";
import { getProduct, getProductsByCategory } from "@/lib/getProducts";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  imagesByColor?: Record<string, string[]>;
  videos?: string[];
  quantité?: number;
  category?: string;
  subCategory?: string;
  colors?: string[];
  marque?: string;
}

interface Props {
  produitId: string;
}

const ProduitPageClient: React.FC<Props> = ({ produitId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainMedia, setMainMedia] = useState<{
    type: "image" | "video";
    src: string;
  } | null>(null);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  // ⭐ Favoris
  const [favorites, setFavorites] = useState<Product[]>([]);
  const isFavorite = favorites.some((f) => f.id === Number(produitId));

  // Charger produit, panier, favoris
  useEffect(() => {
    const p = getProduct(Number(produitId));
    if (p) {
      setProduct(p);

      setMainMedia({
        type: "image",
        src: p.images?.[0] || p.image || "",
      });

      const allProducts = getProductsByCategory(p.category || "").filter(
        (sp) => sp.id !== p.id
      );

      const similars = allProducts.filter(
        (sp) =>
          (sp.marque && sp.marque === p.marque) ||
          (sp.subCategory && sp.subCategory === p.subCategory)
      );

      setSimilarProducts(similars.slice(0, 4));
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedFav = localStorage.getItem("favorites");
    if (savedFav) setFavorites(JSON.parse(savedFav));
  }, [produitId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ⭐ Ajouter / Retirer Favoris
  const toggleFavorite = () => {
    if (!product) return;

    const already = favorites.some((f) => f.id === product.id);

    if (already) {
      const updated = favorites.filter((f) => f.id !== product.id);
      setFavorites(updated);
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const handleAddToCart = (produit: Product) => {
    if (!selectedColor)
      return alert("Sélectionne une couleur avant d'ajouter au panier !");

    const existing = cart.find(
      (p) => p.id === produit.id && p.colors?.includes(selectedColor)
    );

    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === produit.id && p.colors?.includes(selectedColor)
            ? { ...p, quantité: (p.quantité || 1) + quantity }
            : p
        )
      );
    } else {
      setCart([...cart, { ...produit, quantité: quantity }]);
    }

    alert(`${produit.name} (${selectedColor}) ajouté au panier !`);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setMediaIndex(0);

    if (product?.imagesByColor?.[color]?.length) {
      setMainMedia({
        type: "image",
        src: product.imagesByColor[color][0],
      });
    } else if (product?.images?.length) {
      setMainMedia({
        type: "image",
        src: product.images[0],
      });
    } else {
      setMainMedia({
        type: "image",
        src: product?.image || "",
      });
    }
  };

  const allMedia = () => {
    if (!product) return [];

    const images =
      selectedColor && product.imagesByColor?.[selectedColor]
        ? product.imagesByColor[selectedColor]
        : product.images || [];

    const videos = product.videos || [];

    return [
      ...images.map((s) => ({ type: "image" as const, src: s })),
      ...videos.map((s) => ({ type: "video" as const, src: s })),
    ];
  };

  const handlePrevMedia = () => {
    const media = allMedia();
    if (!media.length) return;
    const prev = (mediaIndex - 1 + media.length) % media.length;
    setMediaIndex(prev);
    setMainMedia(media[prev]);
  };

  const handleNextMedia = () => {
    const media = allMedia();
    if (!media.length) return;
    const next = (mediaIndex + 1) % media.length;
    setMediaIndex(next);
    setMainMedia(media[next]);
  };

  const handleZoom = () => {
    if (mainMedia) window.open(mainMedia.src, "_blank");
  };

  if (!product)
    return <div className="text-center p-10 text-lg">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* MEDIA */}
        <div className="flex gap-4 relative">

          {/* ⭐ Bouton Favoris */}
          <button
            onClick={toggleFavorite}
            className="absolute right-4 top-4 z-20 bg-white/80 p-2 rounded-full shadow hover:scale-110 transition"
          >
            <Heart
              size={28}
              className={isFavorite ? "text-red-600 fill-red-600" : "text-gray-600"}
            />
          </button>

          <div className="flex flex-col gap-4 flex-1">
            <div
              className="bg-gray-100 rounded-xl p-4 flex items-center justify-center relative cursor-pointer"
              onClick={mainMedia ? handleZoom : undefined}
            >
              {mainMedia?.type === "image" ? (
                <img
                  src={mainMedia.src}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <video
                  src={mainMedia?.src}
                  controls
                  className="w-full h-80 object-contain rounded-lg shadow-md"
                />
              )}

              <button
                onClick={handlePrevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
              >
                &#10094;
              </button>

              <button
                onClick={handleNextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
              >
                &#10095;
              </button>
            </div>

            {/* MINIATURES */}
            <div className="flex gap-3 overflow-x-auto mt-2">
              {allMedia().map((m, idx) => (
                <div key={idx}>
                  {m.type === "image" ? (
                    <img
                      src={m.src}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        mainMedia?.src === m.src
                          ? "border-pink-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => {
                        setMainMedia(m);
                        setMediaIndex(idx);
                      }}
                    />
                  ) : (
                    <video
                      src={m.src}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        mainMedia?.src === m.src
                          ? "border-pink-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => {
                        setMainMedia(m);
                        setMediaIndex(idx);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* INFOS PRODUIT */}
          <div className="flex flex-col justify-start gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-green-700">
              {product.price.toLocaleString()} FCFA
            </div>

            {/* COULEURS */}
            {product.colors && (
              <div>
                <p className="font-semibold mb-2">Couleur :</p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      style={{
                        background: color.includes("gradient")
                          ? color
                          : undefined,
                        backgroundColor: !color.includes("gradient")
                          ? color
                          : undefined,
                      }}
                      className={`h-8 w-8 rounded-full border-2 transition hover:scale-110 ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-red-600 font-semibold">
              🔥 Il reste seulement{" "}
              <span className="font-bold">{product.quantité}</span> en stock !
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="border px-3 py-1 rounded text-xl"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="border px-3 py-1 rounded text-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 bg-pink-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-pink-700 transition w-fit"
            >
              Ajouter au panier
            </button>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p>🚚 Livraison gratuite partout au pays</p>
              <p>🔄 Retour possible sous 10 jours</p>
              <p>💳 Paiement sécurisé</p>
            </div>
          </div>
        </div>

        {/* PRODUITS SIMILAIRES */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((prod) => (
                <Link key={prod.id} href={`/boutique/produit/${prod.id}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
                    <img
                      src={prod.image || "/default.jpg"}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{prod.name}</h3>
                      <p className="text-green-700 font-bold">
                        {prod.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProduitPageClient;
