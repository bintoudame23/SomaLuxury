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
  newName: string;
}
export function UpdateCategory({ categorie }: { categorie: Categorie }) {
  const [name, setName] = useState("");
    useEffect(() => {
      setName(categorie?.newName || "");
    }, [categorie]);
      
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategoryApi(categorie.$id, name);
      alert("Modification effectuée avec succès !");
    } catch (error) {
      console.log("Erreur lors de la mise à jour", error);
    }
  };
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
              <Label htmlFor="name">New</Label>
              <Input
                type="text"
                id="name"
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
