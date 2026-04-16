"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedCouleur?: string[];
}

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

// Map pour convertir les noms de couleur Appwrite en code hex valide
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
          categorie: p.categorie ?? "",
          couleur: Array.isArray(p.couleur) ? p.couleur : [],
          nouveau: p.nouveau ?? false,
        }));

        const p = products.find((pr) => pr.$id === id);

        if (p) {
          setProduct(p);
          if (p.images?.length) setSelectedImage(mediaUrl(p.images[0]));
          setSimilarProducts(
            products.filter((prod) => prod.categorie === p.categorie && prod.$id !== p.$id)
          );
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const toggleColor = (couleur: string) => {
    setSelectedCouleur((prev) =>
      prev.includes(couleur) ? prev.filter((c) => c !== couleur) : [...prev, couleur]
    );
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500 text-lg">Chargement...</div>;
  if (!product)
    return <div className="p-10 text-center text-red-500 text-lg">Produit introuvable.</div>;

  const couleursArray = Array.isArray(product.couleur) ? product.couleur : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">

      {/* PRODUIT DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <p className="text-sm text-gray-400 uppercase tracking-wide">{product.categorie}</p>
          <h1 className="text-4xl font-bold">{product.nom_produit}</h1>
          <p className="text-2xl font-semibold text-gray-800">{product.prix.toLocaleString()} FCFA</p>
          {product.nouveau && <span className="inline-block bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-semibold">Nouveau</span>}
          <p className="text-gray-600 mt-2">{product.description}</p>

          {/* CARACTERISTIQUES */}
          <div className="mt-4 space-y-2">
            {couleursArray.length > 0 && (
              <p className="text-gray-700">
                <span className="font-semibold">Couleur sélectionnée :</span>{" "}
                {selectedCouleur.length > 0 ? selectedCouleur.join(", ") : "Aucune sélection"}
              </p>
            )}
            {product.quantite !== undefined && (
              <p className="text-gray-700">
                <span className="font-semibold">Quantité disponible :</span> {product.quantite}
              </p>
            )}
          </div>

          {/* Couleurs à sélectionner */}
          {couleursArray.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Choisir une couleur</p>
              <div className="flex gap-3 flex-wrap">
                {couleursArray.map((couleur) => {
                  const bgColor = colorMap[couleur] || "#ccc"; 
                  return (
                    <button
                      key={couleur}
                      onClick={() => toggleColor(couleur)}
                      style={{ backgroundColor: bgColor }}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${
                        selectedCouleur.includes(couleur)
                          ? "ring-2 ring-offset-2 ring-black"
                          : "border-gray-300"
                      }`}
                      title={couleur}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="px-4 py-2 border rounded hover:bg-gray-100 transition">-</button>
            <span className="text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 border rounded hover:bg-gray-100 transition">+</button>
          </div>
          <button
            onClick={() => {
              if (couleursArray.length > 0 && selectedCouleur.length === 0) {
                alert("Veuillez sélectionner au moins une couleur.");
                return;
              }
              const item: CartItem = {
                id: product.$id,
                name: product.nom_produit,
                price: product.prix,
                image: selectedImage,
                quantity,
                selectedCouleur: selectedCouleur.length > 0 ? selectedCouleur : undefined,
              };
              addToCart(item);
              alert(
                `${product.nom_produit} ajouté au panier${
                  selectedCouleur.length > 0 ? " (" + selectedCouleur.join(", ") + ")" : ""
                }`
              );
            }}
            className="w-full bg-gray-800 text-white py-3 rounded-full mt-6 hover:bg-gray-700 transition"
          >
            Ajouter au panier
          </button>
        </div>

  
        <div className="relative">
          <button
            onClick={() =>
              toggleFavorite({ id: product.$id, name: product.nom_produit, image: selectedImage, price: product.prix })
            }
            className="absolute top-4 right-4 text-pink-600 text-2xl z-10"
          >
            {isFavorite(product.$id) ? <FaHeart /> : <FaRegHeart />}
          </button>

          <div className="bg-gray-100 p-6 rounded-2xl flex justify-center items-center hover:scale-105 transition-transform">
            <img src={selectedImage || "/default.jpg"} alt={product.nom_produit} className="w-full max-h-[400px] object-contain" />
          </div>
          <div className="flex gap-4 mt-6 flex-wrap">
            {product.images?.map((img) => (
              <img
                key={img}
                src={mediaUrl(img)}
                onClick={() => setSelectedImage(mediaUrl(img))}
                className={`w-20 h-20 object-cover cursor-pointer rounded-lg border-2 transition-all ${
                  selectedImage === mediaUrl(img) ? "border-black" : "border-gray-300 hover:border-black"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div
                key={p.$id}
                onClick={() => router.push(`/boutique/produit/${p.$id}`)}
                className="border p-4 rounded-lg hover:shadow-lg transition cursor-pointer group"
              >
                <div className="relative">
                  <img src={p.images?.[0] ? mediaUrl(p.images[0]) : "/default.jpg"} alt={p.nom_produit} className="w-full h-40 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform" />
                  {p.nouveau && <span className="absolute top-2 left-2 bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full font-semibold">Nouveau</span>}
                </div>
                <h3 className="font-semibold">{p.nom_produit}</h3>
                <p className="text-gray-600 font-bold">{p.prix.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitPage;