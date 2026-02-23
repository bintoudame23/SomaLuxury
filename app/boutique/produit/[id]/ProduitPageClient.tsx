"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProduct } from "@/lib/addProductClient";
import { FaHeart, FaRegHeart, FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Product {
  $id: string;
  nom_produit: string;
  description?: string;
  prix: number;
  images?: string[];
  videos?: string[];
  quantite?: number;
  categorie?: string;
  colors?: string[];
  imagesByColor?: Record<string, string[]>;
}

interface Props {
  produitId: string;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const ProduitPageClient: React.FC<Props> = ({ produitId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainMedia, setMainMedia] = useState<{ type: "image" | "video"; src: string } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  const isFavorite = product ? favorites.some((f) => f.$id === product.$id) : false;

  // Charger produit depuis Appwrite
  useEffect(() => {
    const loadProduct = async () => {
      const products: Product[] = await fetchProduct();
      const p = products.find((pr) => pr.$id === produitId);
      if (p) {
        setProduct(p);
        setMainMedia({ type: "image", src: p.images?.[0] ? mediaUrl(p.images[0]) : "/default.jpg" });

        // Produits similaires
        const similars = products.filter(
          (sp) => sp.$id !== p.$id && sp.categorie === p.categorie
        );
        setSimilarProducts(similars.slice(0, 4));
      }
    };
    loadProduct();
  }, [produitId]);

  // Gestion des favoris
  const toggleFavorite = () => {
    if (!product) return;
    const already = favorites.some((f) => f.$id === product.$id);
    if (already) setFavorites(favorites.filter((f) => f.$id !== product.$id));
    else setFavorites([...favorites, product]);
  };

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedColor && product.colors?.length) return alert("Sélectionne une couleur !");
    const existing = cart.find(
      (p) => p.$id === product.$id && p.colors?.includes(selectedColor || "")
    );
    if (existing) {
      setCart(
        cart.map((p) =>
          p.$id === product.$id && p.colors?.includes(selectedColor || "")
            ? { ...p, quantite: (p.quantite || 1) + quantity }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantite: quantity }]);
    }
    alert(`${product.nom_produit}${selectedColor ? " (" + selectedColor + ")" : ""} ajouté au panier !`);
  };

  // Médias (images + vidéos)
  const allMedia = () => {
    if (!product) return [];
    const images =
      selectedColor && product.imagesByColor?.[selectedColor]
        ? product.imagesByColor[selectedColor]
        : product.images || [];
    const videos = product.videos || [];
    return [
      ...images.map((s) => ({ type: "image" as const, src: mediaUrl(s) })),
      ...videos.map((s) => ({ type: "video" as const, src: mediaUrl(s) })),
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

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setMediaIndex(0);
    if (product?.imagesByColor?.[color]?.length) {
      setMainMedia({ type: "image", src: mediaUrl(product.imagesByColor[color][0]) });
    } else if (product?.images?.length) {
      setMainMedia({ type: "image", src: mediaUrl(product.images[0]) });
    }
  };

  const handleZoom = () => {
    if (mainMedia) window.open(mainMedia.src, "_blank");
  };

  if (!product) return <div className="text-center p-10 text-lg">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* MEDIA */}
        <div className="flex flex-col gap-4 relative">
          <button
            onClick={toggleFavorite}
            className="absolute right-4 top-4 z-20 bg-white/80 p-2 rounded-full shadow hover:scale-110 transition"
          >
            {isFavorite ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-gray-600" />}
          </button>

          <div
            className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center relative cursor-pointer"
            onClick={handleZoom}
          >
            {mainMedia?.type === "image" ? (
              <img src={mainMedia.src} alt={product.nom_produit} className="w-full h-96 object-contain rounded-xl" />
            ) : (
              <video src={mainMedia.src} controls className="w-full h-80 object-contain rounded-xl shadow-md" />
            )}
            <button
              onClick={handlePrevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
            >
              <FaChevronRight />
            </button>
            <button
              onClick={handleZoom}
              className="absolute bottom-2 right-2 bg-white/70 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
            >
              <FaExpand />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto mt-2">
            {allMedia().map((m, idx) => (
              <div key={idx}>
                {m.type === "image" ? (
                  <img
                    src={m.src}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      mainMedia?.src === m.src ? "border-pink-600 scale-110" : "border-gray-300"
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
                      mainMedia?.src === m.src ? "border-pink-600 scale-110" : "border-gray-300"
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
          <h1 className="text-4xl font-bold">{product.nom_produit}</h1>
          <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
          <div className="text-3xl font-bold text-green-700">{product.prix.toLocaleString()} FCFA</div>
          <p className="text-sm text-gray-500">Catégorie : {product.categorie ?? "Non définie"}</p>

          {/* Couleurs */}
          {product.colors && (
            <div>
              <p className="font-semibold mb-2">Couleur :</p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={`h-8 w-8 rounded-full border-2 transition hover:scale-110 ${
                      selectedColor === color ? "border-black scale-110" : "border-gray-300"
                    }`}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-red-600 font-semibold">
            🔥 Stock restant : <span className="font-bold">{product.quantite}</span>
          </p>

          {/* Quantité */}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="border px-3 py-1 rounded text-xl">-</button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="border px-3 py-1 rounded text-xl">+</button>
          </div>

          {/* Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-pink-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-pink-700 transition w-fit"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((prod) => (
              <Link key={prod.$id} href={`/boutique/produit/${prod.$id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
                  <img src={prod.images?.[0] ? mediaUrl(prod.images[0]) : "/default.jpg"} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{prod.nom_produit}</h3>
                    <p className="text-green-700 font-bold">{prod.prix.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitPageClient;
