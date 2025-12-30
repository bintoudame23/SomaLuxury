"use client";

import React, { useEffect, useState } from "react";
import { fetchProduct, addProduct } from "@/lib/addProductClient";
import { fetchCategories } from "@/lib/categorieClient";

/* =====================
   TYPES
===================== */
export interface Produit {
  id: string;
  nom: string;
  description: string;
  prix: number;        // ✅ number
  image: string;
  video?: string;
  categorie: string;
  quantite: number;    // ✅ number
}

interface ProductForm {
  nom: string;
  description: string;
  prix: string;        // ✅ string (input)
  image: string;
  video: string;
  categorie: string;
  quantite: string;    // ✅ string (input)
}

/* =====================
   COMPONENT
===================== */
export default function Produits() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("Toutes");

  const [form, setForm] = useState<ProductForm>({
    nom: "",
    description: "",
    prix: "",
    image: "",
    video: "",
    categorie: "",
    quantite: "",
  });

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const produitsData = await fetchProduct();
        const categoriesData = await fetchCategories();

        setProducts(produitsData);

        const nomsCategories = categoriesData.map(
          (c: any) => c.nom || c.nom_categorie
        );
        setCategories(nomsCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =====================
     FORM
  ===================== */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nom: form.nom,
        description: form.description,
        image: form.image,
        video: form.video || undefined,
        categorie: form.categorie,
        prix: Number(form.prix),
        quantite: Number(form.quantite),
      };

      const newProduct = await addProduct(payload);

      setProducts((prev) => [
        ...prev,
        {
          id: newProduct.$id,
          ...payload,
        },
      ]);

      setForm({
        nom: "",
        description: "",
        prix: "",
        image: "",
        video: "",
        categorie: "",
        quantite: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du produit");
    }
  };

  /* =====================
     FILTER
  ===================== */
  const produitsFiltres = products.filter((p) => {
    const okNom = p.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const okCat =
      selectedCategorie === "Toutes" ||
      p.categorie === selectedCategorie;

    return okNom && okCat;
  });

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col md:flex-row gap-6">
      {/* PRODUITS */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-6">
          🛒 Produits
        </h1>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6"
        >
          <h2 className="text-xl font-bold mb-4">
            ➕ Ajouter un produit
          </h2>

          <input
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="number"
            name="prix"
            placeholder="Prix"
            value={form.prix}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
            required
          />

          <input
            type="number"
            name="quantite"
            placeholder="Quantité"
            value={form.quantite}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
            required
          />

          <input
            name="image"
            placeholder="URL image"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            name="video"
            placeholder="URL vidéo"
            value={form.video}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />

          <select
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            required
          >
            <option value="">-- Catégorie --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white p-2 rounded w-full">
            Ajouter
          </button>
        </form>

        {/* RECHERCHE */}
        <input
          className="border p-2 rounded w-full mb-6"
          placeholder="🔍 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* LISTE */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produitsFiltres.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              {p.image && (
                <img
                  src={p.image}
                  className="h-40 w-full object-cover rounded"
                />
              )}

              <h3 className="font-bold mt-2">{p.nom}</h3>
              <p className="text-sm text-gray-500">{p.categorie}</p>

              <p className="font-bold text-blue-600">
                {p.prix.toLocaleString()} FCFA
              </p>

              <p>Stock : {p.quantite}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <aside className="w-full md:w-64 bg-white p-4 rounded shadow h-fit">
        <h3 className="font-semibold mb-3">📂 Catégories</h3>

        <button
          onClick={() => setSelectedCategorie("Toutes")}
          className="block w-full p-2 text-left hover:bg-gray-100 rounded"
        >
          Toutes
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategorie(cat)}
            className="block w-full p-2 text-left hover:bg-gray-100 rounded"
          >
            {cat}
          </button>
        ))}
      </aside>
    </div>
  );
}
