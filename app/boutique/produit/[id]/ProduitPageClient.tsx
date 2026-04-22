"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProduct } from "@/lib/addProductClient";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/context/CartContext";

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

interface ProduitPageClientProps {
  produitId: string;
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const colorMap: Record<string, string> = {
  "Bleu ciel": "#87CEEB",
  Bleu: "#0000FF",
  Rouge: "#FF0000",
  Vert: "#00FF00",
  Jaune: "#FFFF00",
  Noir: "#000000",
  Blanc: "#FFFFFF",
  Gris: "#808080",
  Orange: "#FFA500",
  Rose: "#FFC0CB",
};

const ProduitPageClient: React.FC<ProduitPageClientProps> = ({
  produitId,
}) => {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCouleur, setSelectedCouleur] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      try {
        const res = await fetchProduct();

        const products: Product[] = res.map((p: any) => ({
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

        const found = products.find((p) => p.$id === produitId);

        if (!found) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(found);

        setSelectedImage(
          found.images?.length ? mediaUrl(found.images[0]) : "/default.jpg"
        );

        setSimilarProducts(
          products.filter(
            (p) =>
              p.categorie === found.categorie && p.$id !== found.$id
          )
        );
      } catch (err) {
        console.error("Erreur produit :", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (produitId) loadProduct();
  }, [produitId]);

  const toggleColor = (color: string) => {
    setSelectedCouleur((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  if (loading)
    return <div className="p-10 text-center">Chargement...</div>;

  if (!product)
    return (
      <div className="p-10 text-center text-red-500">
        Produit introuvable
      </div>
    );

  // ✅ FIX IMPORTANT TS ERROR
  const couleursArray = product.couleur ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">

      {/* PRODUIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT */}
        <div className="space-y-6">

          <h1 className="text-4xl font-bold">
            {product.nom_produit}
          </h1>

          <p className="text-2xl font-semibold">
            {product.prix.toLocaleString()} FCFA
          </p>

          <p>{product.description}</p>

          {/* COULEURS */}
          {couleursArray.length > 0 && (
            <div>
              <p className="font-medium mb-2">Couleurs disponibles</p>

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

          {/* QUANTITY */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() =>
                quantity > 1 && setQuantity(quantity - 1)
              }
            >
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => {
              addToCart({
                id: product.$id,
                name: product.nom_produit,
                price: product.prix,
                image: selectedImage,
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
            src={selectedImage}
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

      {/* SIMILAIRES */}
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

export default ProduitPageClient;