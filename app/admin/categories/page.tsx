"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  IconFolderPlus, IconTrash, IconPencil, IconPlus, IconChevronDown, IconChevronRight
} from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";

import { fetchCategories, addCategorie, updateCategory, deleteCategory } from "@/lib/categorieClient";

interface Category {
  $id: string;
  nom_categorie: string;
  subCategories: string[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([""]);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };
  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setNewName(category.nom_categorie);
      setSubCategories(category.subCategories.length > 0 ? category.subCategories : [""]);
    } else {
      setEditingCategory(null);
      setNewName("");
      setSubCategories([""]);
    }
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setNewName("");
    setSubCategories([""]);
    setEditingCategory(null);
  };

  const addSubCategory = () => setSubCategories([...subCategories, ""]);
  const updateSubCategory = (index: number, value: string) => {
    const copy = [...subCategories];
    copy[index] = value;
    setSubCategories(copy);
  };
  const removeSubCategory = (index: number) =>
    setSubCategories(subCategories.filter((_, i) => i !== index));
  const saveCategory = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);

    try {
      const cleanSubs = subCategories.filter(s => s.trim() !== "");

      if (editingCategory) {
        await updateCategory(editingCategory.$id, { nom_categorie: newName, subCategories: cleanSubs });
      } else {
        await addCategorie(newName, cleanSubs);
      }

      await loadCategories();
      closeDialog();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'opération");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await deleteCategory(id);
    await loadCategories();
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-gray-500">Gestion complète des catégories et sous-catégories</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="flex items-center gap-2">
              <IconFolderPlus size={18} /> Ajouter une catégorie
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nom de la catégorie"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">Sous-catégories</p>
                {subCategories.map((sub, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Sous-catégorie ${idx + 1}`}
                      value={sub}
                      onChange={e => updateSubCategory(idx, e.target.value)}
                    />
                    <Button variant="ghost" onClick={() => removeSubCategory(idx)}>
                      <IconTrash size={16} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addSubCategory} className="w-full flex items-center justify-center gap-2">
                  <IconPlus size={16} /> Ajouter une sous-catégorie
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveCategory} className="flex-1 flex items-center justify-center gap-2">
                  {submitting && <Spinner />}
                  {editingCategory ? "Modifier" : "Ajouter"}
                </Button>
                <Button variant="ghost" onClick={closeDialog} className="flex-1">Annuler</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTE CATEGORIES */}
      <Card className="shadow-lg">
        <CardHeader><CardTitle>Liste des catégories</CardTitle></CardHeader>
        <CardContent>
          {categories.length === 0 && <p className="text-gray-500">Aucune catégorie</p>}

          {categories.map(cat => (
            <div key={cat.$id} className="mb-4 border rounded p-3 hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {cat.subCategories?.length > 0 && (
                    <button onClick={() => toggleExpand(cat.$id)}>
                      {expandedCategories.includes(cat.$id) ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                    </button>
                  )}
                  <span className="font-semibold text-lg">{cat.nom_categorie}</span>
                  <span className="text-sm text-gray-400">{cat.subCategories?.length || 0} sous-catégorie(s)</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openDialog(cat)} className="text-blue-600"><IconPencil size={16} /></button>
                  <button onClick={() => handleDelete(cat.$id)} className="text-red-600"><IconTrash size={16} /></button>
                </div>
              </div>

              {expandedCategories.includes(cat.$id) && cat.subCategories?.length > 0 && (
                <div className="ml-6 mt-2 flex flex-wrap gap-2">
                  {cat.subCategories.map((sub, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{sub}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
