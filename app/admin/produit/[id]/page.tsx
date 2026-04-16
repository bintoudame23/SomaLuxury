"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProduct, updateProduct, deleteProduct } from "@/lib/addProductClient";
import { fetchCategories } from "@/lib/categorieClient";

const mediaUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

interface Category {
  $id: string;
  nom_categorie: string;
  subCategories: string[];
}

export default function ProduitDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const [produit, setProduit] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: 0,
    quantite: 0,
    couleur: "",
    categorie: "",
    subCategorie: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [imageModal, setImageModal] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchProduct().then((res) => {
      const p = res.find((p: any) => p.$id === id);
      setProduit(p);

      if (p) {
        setForm({
          nom: p.nom_produit ?? "",
          description: p.description ?? "",
          prix: p.prix ?? 0,
          quantite: p.quantite ?? 0,
          couleur: p.couleur ?? "",
          categorie: p.categorie ?? "",
          subCategorie: p.subCategorie?.[0] ?? "",
        });
      }
    });
  }, [id]);

  useEffect(() => {
    if (!form.categorie) {
      setSubCategories([]);
      return;
    }

    const selected = categories.find(
      (c) => c.nom_categorie === form.categorie
    );

    setSubCategories(selected?.subCategories ?? []);
  }, [form.categorie, categories]);

  if (!produit)
    return <div className="p-6 text-center text-gray-500 text-lg">Chargement...</div>;

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    await deleteProduct(id);
    alert("Produit supprimé !");
    router.push("/admin/produit");
  };

  const handleSave = async () => {
    if (!id) return;

    await updateProduct(id, {
      nom_produit: form.nom,
      description: form.description,
      prix: Number(form.prix),
      quantite: Number(form.quantite),
      couleur: form.couleur,
      categorie: form.categorie,
      subCategorie: form.subCategorie ? [form.subCategorie] : [],
    });

    setProduit({
      ...produit,
      ...form,
      subCategorie: form.subCategorie ? [form.subCategorie] : [],
    });

    setEditing(false);
    alert("Produit mis à jour avec succès !");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        ← Retour
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* MÉDIAS */}
        <div className="space-y-4">
          {produit.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {produit.images.map((img: string) => (
                <img
                  key={img}
                  src={mediaUrl(img)}
                  className="w-full h-48 object-cover rounded-xl shadow cursor-pointer"
                  onClick={() => setImageModal(mediaUrl(img))}
                />
              ))}
            </div>
          )}

          {produit.videos?.length > 0 && (
            <div className="space-y-4">
              {produit.videos.map((vid: string) => (
                <video key={vid} src={mediaUrl(vid)} controls className="w-full rounded-xl shadow" />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          {!editing ? (
            <>
              <h1 className="text-4xl font-bold">{produit.nom_produit}</h1>
              <p className="text-gray-700">{produit.description}</p>

              <div className="flex flex-wrap gap-4">
                <p className="badge">💰 {produit.prix} FCFA</p>
                <p className="badge">📦 Stock : {produit.quantite}</p>
                <p className="badge">🎨 {produit.couleur || "Non définie"}</p>
                <p className="badge">
                  🗂 {produit.categorie}
                  {produit.subCategorie && ` → ${produit.subCategorie}`}
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setEditing(true)} className="btn-success">Modifier</button>
                <button onClick={handleDelete} className="btn-danger">Supprimer</button>
                <button onClick={() => router.push("/admin/produit")} className="btn-secondary">Retour</button>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-2xl font-bold">Modifier le produit</h2>

              <input className="input w-full" placeholder="Nom"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
              />

              <textarea className="input w-full" placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <input type="number" className="input w-full" placeholder="Prix"
                value={form.prix}
                onChange={e => setForm({ ...form, prix: Number(e.target.value) })}
              />

              <input type="number" className="input w-full" placeholder="Stock"
                value={form.quantite}
                onChange={e => setForm({ ...form, quantite: Number(e.target.value) })}
              />

              <input className="input w-full" placeholder="Couleur"
                value={form.couleur}
                onChange={e => setForm({ ...form, couleur: e.target.value })}
              />

              <select
                className="input w-full"
                value={form.categorie}
                onChange={(e) =>
                  setForm({ ...form, categorie: e.target.value, subCategorie: "" })
                }
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                  <option key={c.$id} value={c.nom_categorie}>
                    {c.nom_categorie}
                  </option>
                ))}
              </select>

              {subCategories.length > 0 && (
                <select
                  className="input w-full"
                  value={form.subCategorie}
                  onChange={(e) =>
                    setForm({ ...form, subCategorie: e.target.value })
                  }
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex gap-4">
                <button onClick={handleSave} className="btn-success">💾 Enregistrer</button>
                <button onClick={() => setEditing(false)} className="btn-secondary">Annuler</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {imageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
             onClick={() => setImageModal(null)}>
          <img src={imageModal} className="max-h-[90%] max-w-[90%] rounded-xl" />
        </div>
      )}
    </div>
  );
}