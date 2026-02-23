"use client";

import React, { useEffect, useState } from "react";
import { fetchOrders } from "@/lib/commandesClient";

interface OrderProduct {
  nom_produit: string;
  prix: number;
  quantitePanier: number;
}

interface Order {
  $id: string;
  clientNom: string;
  clientEmail: string;
  total: number;
  produits: OrderProduct[];
  statut: string;
  $createdAt: string;
}

const CommandesAdminPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Erreur récupération commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Commandes clients</h1>

      {orders.length === 0 && <p>Aucune commande trouvée.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.$id}
            className="border rounded-lg p-4 shadow space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-semibold">Commande #{order.$id}</p>
              <span className="text-sm text-gray-500">
                {new Date(order.$createdAt).toLocaleString()}
              </span>
            </div>

            <p>👤 Client : {order.clientNom}</p>
            <p>📧 Email : {order.clientEmail}</p>
            <p>📌 Statut : {order.statut}</p>
            <p className="font-bold">💰 Total : {order.total} FCFA</p>

            <div className="mt-2">
              <p className="font-semibold">Produits :</p>
              <ul className="list-disc ml-6">
               {order.produits?.map((p, index) => (

                  <li key={index}>
                    {p.nom_produit} × {p.quantitePanier} — {p.prix} FCFA
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandesAdminPage;
