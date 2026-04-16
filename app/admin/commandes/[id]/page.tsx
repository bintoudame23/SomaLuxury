"use client";

import React, { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;

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

const OrderDetailPage: React.FC = () => {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const doc = await databases.getDocument(DATABASE_ID, ORDERS_COLLECTION, orderId);
        setOrder({
          $id: doc.$id,
          clientName: doc.clientName || "Client inconnu",
          clientEmail: doc.clientEmail || "Email inconnu",
          total: Number(doc.total) || 0,
          produits: typeof doc.produits === "string" ? JSON.parse(doc.produits) : doc.produits || [],
          paymentStatus: doc.paymentStatus || "pending",
          $createdAt: doc.$createdAt,
        });
      } catch (err) {
        console.error("Erreur récupération commande :", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Commande #{order.$id}</h1>
      <Card className="mb-6">
        <CardContent>
          <p>👤 Client : {order.clientName}</p>
          <p>📧 Email : {order.clientEmail}</p>
          <p>💰 Total : {order.total.toLocaleString()} FCFA</p>
          <p>📅 Date : {new Date(order.$createdAt).toLocaleString()}</p>
          <p>📌 Statut : {order.paymentStatus}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="font-semibold mb-2">Produits :</p>
          <ul className="list-disc ml-6 space-y-1">
            {order.produits.map((p, i) => (
              <li key={i}>
                {p.nom_produit} × {p.quantite} — {Number(p.prix).toLocaleString()} FCFA
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;