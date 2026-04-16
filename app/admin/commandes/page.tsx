"use client";

import React, { useEffect, useState } from "react";
import { databases, Query } from "@/lib/appwrite";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// 🔹 Appwrite IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;
const HISTORY_COLLECTION = process.env.NEXT_PUBLIC_TABLE_HISTORIQUECOMMANDE_ID!;

interface OrderProduct {
  nom_produit: string;
  prix: number;
  quantite: number;
}

interface Order {
  $id: string;
  clientName: string;
  clientEmail: string;
  total: number;
  produits: OrderProduct[];
  paymentStatus: string;
  $createdAt: string;
}

const CommandesAdminPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");

  // 🔹 Récupérer commandes pending
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("paymentStatus", "pending"), Query.orderDesc("$createdAt")]
      );

      const ordersData: Order[] = res.documents.map((doc: any) => ({
        $id: doc.$id,
        clientName: doc.clientName || "Client inconnu",
        clientEmail: doc.clientEmail || "Email inconnu",
        total: Number(doc.total) || 0,
        produits:
          typeof doc.produits === "string"
            ? JSON.parse(doc.produits)
            : doc.produits || [],
        paymentStatus: doc.paymentStatus || "pending",
        $createdAt: doc.$createdAt,
      }));

      setOrders(ordersData);
    } catch (err) {
      console.error("Erreur récupération commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Archiver la commande et retirer de commandes
  const markAsPaid = async (order: Order) => {
    try {
      // 🔹 Ajouter uniquement les champs existants dans la collection historique
      await databases.createDocument(DATABASE_ID, HISTORY_COLLECTION, "unique()", {
        total: order.total,
        date: new Date().toISOString(),
      });

      // 🔹 Mettre à jour commande originale pour qu'elle ne soit plus "pending"
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, order.$id, {
        paymentStatus: "paid",
      });

      // 🔹 Retirer de la liste locale
      setOrders((prev) => prev.filter((o) => o.$id !== order.$id));
    } catch (err) {
      console.error("Erreur lors de l'archivage :", err);
      alert("❌ Impossible de marquer la commande comme payée");
    }
  };

  // 🔹 Filtrage
  const filteredOrders = orders.filter((order) => {
    const date = new Date(order.$createdAt);
    const matchesMonth =
      filterMonth === "all" ? true : date.getMonth() === Number(filterMonth);
    const matchesDate = filterDate ? date.toISOString().slice(0, 10) === filterDate : true;
    return matchesMonth && matchesDate;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Commandes clients</h1>

      {/* FILTRES */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span>Filtrer par mois :</span>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i}>
                  {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>Filtrer par date :</span>
          <input
            type="date"
            className="border rounded-lg p-2"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Chargement des commandes...</p>}
      {!loading && filteredOrders.length === 0 && <p>Aucune commande trouvée.</p>}

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.$id}
            className="border rounded-lg p-6 shadow-md space-y-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/admin/commandes/${order.$id}`)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">Commande #{order.$id}</p>
              <span className="text-sm text-gray-500">
                {new Date(order.$createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <p>👤 Client : {order.clientName}</p>
              <p>📧 Email : {order.clientEmail}</p>
              <p className="font-bold">
                💰 Total : {Number(order.total).toLocaleString()} FCFA
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">Produits :</p>
              <ul className="list-disc ml-6 space-y-1">
                {order.produits.map((p, idx) => (
                  <li key={idx}>
                    {p.nom_produit} × {p.quantite} — {Number(p.prix).toLocaleString()} FCFA
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="border-green-600 text-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsPaid(order);
                }}
              >
                Marquer comme payée
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandesAdminPage;