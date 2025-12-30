"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IconFolderPlus, IconTrash, IconPencil, IconEye } from "@tabler/icons-react";
import { addCategorie, fetchCategories, updateCategory as updateCategoryApi,deleteCategory as deleteCategoryApi }from "@/lib/categorieClient";
import { Spinner } from "@/components/ui/spinner";
import { promise } from "zod";
import { UpdateCategory } from "@/components/updateCategory";

interface Category {
  id: number;
  name: string;
  products: number;
}

export default function CategoriesPage() {
 
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false)
  
  const openAdd = () => {
    setEditingId(null);
    setNewName("");
    setIsOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat);
    setNewName(cat.name);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditingId(null);
    setNewName("");
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchCategories();
      setCategories(response)
    }
    fetch()
  }, [])

  console.log(categories);
  
  const saveCategory =async () => {
    setSubmitting(true)
    try {
      const response = await addCategorie(newName)
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally{
      setSubmitting(false)
      closeDialog();
    }
  };
  // non
const updateCategory = async (rowId: string, newName: string) => {
    try {
        await updateCategoryApi(rowId, newName);
        setCategories((prev) =>
            prev.map((cat) =>
                cat.$id === rowId ? { ...cat, nom_categorie: newName }: cat
            )
        );
        alert("modification avec succes!");
    } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de la modification.");
    }
};
const deleteCategory = async (rowId: string) => {
    if (!window.confirm("Voulez-vous supprimer cette catégorie ?")) 
      return;
    try {
        await deleteCategoryApi(rowId);
        setCategories((prev) =>
            prev.filter((cat) => cat.$id !== rowId)
        );
        alert("Catégorie supprimée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur est survenue lors de la suppression.");
    }
};
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-gray-500">Gestion des catégories de produits.</p>
        </div>
        <div>
          <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="flex items-center gap-2">
                <IconFolderPlus size={18} />
                Ajouter une catégorie
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-3">
                <Input
                  placeholder="Nom de la catégorie"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={saveCategory} className="flex-1">
                    {submitting && <Spinner/>}
                    {editingId ? "Enregistrer" : "Ajouter"}
                  </Button>
                  <Button variant="ghost" onClick={closeDialog} className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm text-gray-600">Nom</th>
                  <th className="p-3 text-sm text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Aucune catégorie.
                    </td>
                  </tr>
                )}
                {categories.map((cat) => (
                  <tr key={cat.$id} className="border-b hover:bg-gray-50">
                    <td className="p-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{cat.nom_categorie}</div>
                      </div>
                    </td> 
                    <td className="p-3 align-middle text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/produit?category=${encodeURIComponent(cat.name)}`}
                          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <IconEye size={16} /> Voir
                        </Link>
                      <UpdateCategory categorie={cat} />
                          <button
                           onClick={() => deleteCategory(cat.$id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Supprimer ${cat.nom_categorie}`}
                        >
                          <IconTrash size={18} />
                        </button>                                                   
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
