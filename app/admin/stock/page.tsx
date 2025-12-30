"use client";

import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  IconArchive,
  IconPlus,
  IconMinus,
//   IconBoxes,
  IconPackage,
} from "@tabler/icons-react";

interface StockItem {
  id: number;
  name: string;
  category: string;
  stock: number;
}

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([
    { id: 1, name: "Crème hydratante", category: "Beauté", stock: 40 },
    { id: 2, name: "T-shirt coton", category: "Vêtements", stock: 12 },
    { id: 3, name: "Sac à main", category: "Accessoires", stock: 5 },
  ]);

  const [selected, setSelected] = useState<StockItem | null>(null);
  const [qty, setQty] = useState<number>(0);

  const updateStock = () => {
    if (!selected) return;
    setItems(
      items.map((i) =>
        i.id === selected.id ? { ...i, stock: i.stock + qty } : i
      )
    );
    setSelected(null);
    setQty(0);
  };

  const totalStock = items.reduce((acc, s) => acc + s.stock, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Stock</h1>
        <p className="text-gray-500">Suivi des niveaux de stock de vos produits.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Produits</CardTitle>
            {/* <IconBoxes size={28} className="text-primary" /> */}
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {items.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock total</CardTitle>
            <IconArchive size={28} className="text-primary" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {totalStock}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produits critiques</CardTitle>
            <IconPackage size={28} className="text-red-500" />
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-600">
            {items.filter((i) => i.stock <= 5).length}
          </CardContent>
        </Card>

      </div>

      {/* Liste du stock */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des produits</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Produit</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td
                    className={`p-3 font-semibold ${
                      item.stock <= 5 ? "text-red-600" : ""
                    }`}
                  >
                    {item.stock}
                  </td>

                  <td className="p-3 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => setSelected(item)}
                        >
                          <IconPlus size={18} />
                          Ajuster
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajuster le stock</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-gray-500 mb-2">
                          Produit : <strong>{selected?.name}</strong>
                        </p>

                        <Input
                          type="number"
                          placeholder="Quantité"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        />

                        <Button className="mt-4 w-full" onClick={updateStock}>
                          Valider l’ajustement
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
