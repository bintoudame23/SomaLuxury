"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
} from "@/lib/addProductClient";
import { fetchCategories } from "@/lib/categorieClient";
import { uploadMedia } from "@/lib/uploadMedia";

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

type ProduitForm = {
  nom: string;
  description: string;
  prix: string;
  quantite: string;
  couleur: string;
  categorie: string;
  subCategorie?: string;
};

type SortOption = "alphabet" | "prix" | "quantite";

export default function ProduitsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<any[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [form, setForm] = useState<ProduitForm>({
    nom: "",
    description: "",
    prix: "",
    quantite: "",
    couleur: "",
    categorie: "",
    subCategorie: "",
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("alphabet");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [produits, sortBy, categoryFilter]);

  // ✅ Charger les sous-catégories depuis la catégorie sélectionnée
  useEffect(() => {
    if (!form.categorie) {
      setSubCategories([]);
      setForm(prev => ({ ...prev, subCategorie: "" }));
      return;
    }

    const selectedCategory = categories.find(c => c.$id === form.categorie);
    setSubCategories(selectedCategory?.subCategories || []);
  }, [form.categorie, categories]);

  const loadData = async () => {
    const [cats, prods] = await Promise.all([
      fetchCategories(),
      fetchProduct(),
    ]);
    setCategories(cats);
    setProduits(prods);
  };

  // -----------------------------
  // FILTER & SORT
  // -----------------------------
  const filterAndSortProducts = () => {
    let filtered = [...produits];

    if (categoryFilter) {
      filtered = filtered.filter(
        p =>
          p.categorie ===
          categories.find(c => c.$id === categoryFilter)?.nom_categorie
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "alphabet") return a.nom_produit.localeCompare(b.nom_produit);
      if (sortBy === "prix") return a.prix - b.prix;
      if (sortBy === "quantite") return a.quantite - b.quantite;
      return 0;
    });

    setFilteredProduits(filtered);
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageIds = images.length ? await uploadMedia(images) : [];
    const videoIds = videos.length ? await uploadMedia(videos) : [];

    const selectedCatName =
      categories.find(c => c.$id === form.categorie)?.nom_categorie ||
      "Non définie";

    const productData: any = {
      nom_produit: form.nom,
      description: form.description,
      prix: Number(form.prix),
      quantite: Number(form.quantite),
      couleur: form.couleur,
      categorie: selectedCatName,
      images: imageIds,
      videos: videoIds,
      subCategorie: form.subCategorie ? [form.subCategorie] : [],
    };

    if (editingProductId) {
      await updateProduct(editingProductId, productData);
      alert("Produit modifié avec succès 🎉");
      setEditingProductId(null);
    } else {
      await addProduct(productData);
      alert("Produit ajouté avec succès 🎉");
    }

    resetForm();
    await loadData();
  };

  const resetForm = () => {
    setForm({
      nom: "",
      description: "",
      prix: "",
      quantite: "",
      couleur: "",
      categorie: "",
      subCategorie: "",
    });
    setImages([]);
    setVideos([]);
    setEditingProductId(null);
    setSubCategories([]);
  };

  // -----------------------------
  // ACTIONS
  // -----------------------------
  const removeProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(id);
    await loadData();
  };

  const reduceQuantity = async (p: any) => {
    if (p.quantite <= 0) return alert("Stock épuisé");
    await updateProduct(p.$id, { quantite: p.quantite - 1 });
    await loadData();
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4"
      >
        <h2 className="text-2xl font-bold col-span-full">
          {editingProductId ? "✏️ Modifier le produit" : "➕ Ajouter un produit"}
        </h2>

        <input
          className="input"
          placeholder="Nom"
          required
          value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
        />

        <input
          className="input"
          type="number"
          placeholder="Prix"
          required
          value={form.prix}
          onChange={e => setForm({ ...form, prix: e.target.value })}
        />

        <input
          className="input"
          type="number"
          placeholder="Quantité"
          required
          value={form.quantite}
          onChange={e => setForm({ ...form, quantite: e.target.value })}
        />

        <input
          className="input"
          placeholder="Couleur"
          value={form.couleur}
          onChange={e => setForm({ ...form, couleur: e.target.value })}
        />

        {/* CATEGORIE */}
        <select
          className="input"
          required
          value={form.categorie}
          onChange={e => setForm({ ...form, categorie: e.target.value })}
        >
          <option value="">Catégorie</option>
          {categories.map(c => (
            <option key={c.$id} value={c.$id}>
              {c.nom_categorie}
            </option>
          ))}
        </select>

        {/* ✅ SUB-CATEGORIE AUTO */}
        {subCategories.length > 0 && (
          <select
            className="input"
            value={form.subCategorie}
            onChange={e => setForm({ ...form, subCategorie: e.target.value })}
          >
            <option value="">Sous-catégorie (facultatif)</option>
            {subCategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <textarea
          className="input col-span-full"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setImages(Array.from(e.target.files || []))}
        />

        <input
          type="file"
          multiple
          accept="video/*"
          onChange={e => setVideos(Array.from(e.target.files || []))}
        />

        <div className="col-span-full flex gap-2">
          <button className="btn-primary flex-1">
            {editingProductId ? "Enregistrer" : "Ajouter"}
          </button>

          {editingProductId && (
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={resetForm}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* ================= TRI & FILTRE ================= */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span>🔀 Trier par:</span>
          <select
            className="input w-48"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="alphabet">A → Z</option>
            <option value="prix">Prix croissant</option>
            <option value="quantite">Stock croissant</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span>📂 Filtrer par catégorie:</span>
          <select
            className="input w-48"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">Toutes</option>
            {categories.map(c => (
              <option key={c.$id} value={c.$id}>
                {c.nom_categorie}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= LISTE PRODUITS ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredProduits.map(p => (
          <div
            key={p.$id}
            onClick={() => router.push(`/admin/produit/${p.$id}`)}
            className="bg-white p-4 rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 hover:scale-105"
          >
            <h3 className="font-bold text-lg">{p.nom_produit}</h3>
            <p className="text-gray-700">{p.prix} FCFA</p>
            <p className="text-gray-600">Stock : {p.quantite}</p>
            <p className="text-gray-600">
              Catégorie : {p.categorie}{" "}
              {p.subCategorie?.length > 0 && `→ ${p.subCategorie.join(", ")}`}
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {p.images?.map((img: string) => (
                <img
                  key={img}
                  src={mediaUrl(img)}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={e => {
                  e.stopPropagation();
                  reduceQuantity(p);
                }}
                className="btn-warning"
              >
                -1
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setEditingProductId(p.$id);
                  setForm({
                    nom: p.nom_produit,
                    description: p.description,
                    prix: String(p.prix),
                    quantite: String(p.quantite),
                    couleur: p.couleur,
                    categorie:
                      categories.find(c => c.nom_categorie === p.categorie)?.$id || "",
                    subCategorie: p.subCategorie?.[0] || "",
                  });
                  setImages([]);
                  setVideos([]);
                }}
                className="btn-success"
              >
                Modifier
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  removeProduct(p.$id);
                }}
                className="btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
