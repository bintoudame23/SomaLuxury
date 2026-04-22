"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchProduct } from "@/lib/addProductClient";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/context/CartContext";

// ✅ IMPORTANT : ne pas recréer CartItem avec quantity ici

interface Product {
  $id: string;
  nom_produit: string;
  description?: string;
  prix: number;
  images?: string[];
  quantite?: number;
  categorie?: string;
  couleur?: string[];
  nouveau?: boolean;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

// 🎨 Couleurs
const colorMap: Record<string, string> = {
  "Bleu ciel": "#87CEEB",
  "Bleu": "#0000FF",
  "Rouge": "#FF0000",
  "Vert": "#00FF00",
  "Jaune": "#FFFF00",
  "Noir": "#000000",
  "Blanc": "#FFFFFF",
  "Gris": "#808080",
  "Orange": "#FFA500",
  "Rose": "#FFC0CB",
};

const ProduitPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCouleur, setSelectedCouleur] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  // 🔥 LOAD PRODUIT
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productsRaw = await fetchProduct();

        const products: Product[] = (productsRaw as any[]).map((p) => ({
          $id: p.$id,
          nom_produit: p.nom_produit ?? "Produit inconnu",
          description: p.description ?? "",
          prix: p.prix ?? 0,
          images: p.images ?? [],
          quantite: p.quantite ?? 0,
          categorie:
            typeof p.categorie === "object"
              ? p.categorie.nom_categorie
              : p.categorie ?? "",
          couleur: Array.isArray(p.couleur) ? p.couleur : [],
          nouveau: p.nouveau ?? false,
        }));

        const found = products.find((pr) => pr.$id === id);

        if (found) {
          setProduct(found);

          if (found.images?.length) {
            setSelectedImage(mediaUrl(found.images[0]));
          }

          setSimilarProducts(
            products.filter(
              (prod) =>
                prod.categorie === found.categorie &&
                prod.$id !== found.$id
            )
          );
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Erreur produit :", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  // 🎨 SELECT COULEUR
  const toggleColor = (couleur: string) => {
    setSelectedCouleur((prev) =>
      prev.includes(couleur)
        ? prev.filter((c) => c !== couleur)
        : [...prev, couleur]
    );
  };

  if (loading)
    return <div className="p-10 text-center">Chargement...</div>;

  if (!product)
    return <div className="p-10 text-center text-red-500">Produit introuvable</div>;

  const couleursArray = product.couleur || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">

      {/* 🧾 PRODUIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT */}
        <div className="space-y-6">
          <p className="text-sm text-gray-400 uppercase">
            {product.categorie}
          </p>

          <h1 className="text-4xl font-bold">
            {product.nom_produit}
          </h1>

          <p className="text-2xl font-semibold">
            {product.prix.toLocaleString()} FCFA
          </p>

          <p className="text-gray-600">
            {product.description}
          </p>

          {/* COULEURS */}
          {couleursArray.length > 0 && (
            <div>
              <p className="font-medium mb-2">Choisir une couleur</p>

              <div className="flex gap-3 flex-wrap">
                {couleursArray.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    style={{ backgroundColor: colorMap[c] || "#ccc" }}
                    className={`w-10 h-10 rounded-full border ${
                      selectedCouleur.includes(c)
                        ? "ring-2 ring-black"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* QUANTITÉ (UI seulement) */}
          <div className="flex gap-4 items-center">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>
<button
  onClick={() => {
    if (couleursArray.length > 0 && selectedCouleur.length === 0) {
      alert("Veuillez sélectionner une couleur");
      return;
    }

    addToCart({
      id: product.$id,
      name: product.nom_produit,
      price: product.prix,
      image: selectedImage,

      // ✅ OK maintenant car context supporte
      selectedCouleur:
        selectedCouleur.length > 0 ? selectedCouleur : undefined,
    });

    alert("Produit ajouté au panier");
  }}
  className="w-full bg-gray-800 text-white py-3 rounded-full"
>
  Ajouter au panier
</button>
        </div>

        {/* RIGHT */}
        <div>
          <img
            src={selectedImage || "/default.jpg"}
            className="w-full h-[400px] object-contain"
          />

          <div className="flex gap-3 mt-4">
            {product.images?.map((img) => (
              <img
                key={img}
                src={mediaUrl(img)}
                onClick={() => setSelectedImage(mediaUrl(img))}
                className="w-20 h-20 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 SIMILAIRES */}
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Produits similaires
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div
                key={p.$id}
                onClick={() =>
                  router.push(`/boutique/produit/${p.$id}`)
                }
                className="cursor-pointer"
              >
                <img
                  src={
                    p.images?.[0]
                      ? mediaUrl(p.images[0])
                      : "/default.jpg"
                  }
                  className="h-40 w-full object-cover"
                />

                <p>{p.nom_produit}</p>
                <p>{p.prix.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitPage;