"use client";

import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { updateCategory as updateCategoryApi } from "@/lib/categorieClient";

interface Categorie {
  $id: string;
  nom_categorie: string;
}

export function UpdateCategory({
  categorie,
}: {
  categorie: Categorie;
}) {
  const [name, setName] = useState<string>("");

  /* ================= INIT ================= */
  useEffect(() => {
    if (categorie?.nom_categorie) {
      setName(categorie.nom_categorie);
    }
  }, [categorie]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCategoryApi(categorie.$id, {
        nom_categorie: name.trim(), // ✅ FIX IMPORTANT
      });

      alert("Modification effectuée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  /* ================= UI ================= */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <IconPencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modification de la catégorie</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la catégorie</Label>

              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la catégorie"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>

            <Button type="submit">Sauvegarder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}