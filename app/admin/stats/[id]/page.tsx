"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Calendar,
  Hash,
  Clock,
  Phone,
  MapPin
} from "lucide-react";

import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;

interface OrderProduct {
  nom_produit: string;
  prix: number;
  quantite: number;
}

interface OrderType {
  $id: string;
  clientName: string;
  clientEmail: string;
  clientNumero: string;
  quartier: string;
  total: number;
  produits: OrderProduct[];
  paymentStatus: string;
  $createdAt: string;
}

export default function CommandDetailPage() {

  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [paidIndex, setPaidIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const doc: any = await databases.getDocument(
          DATABASE_ID,
          ORDERS_COLLECTION,
          orderId
        );

        const produitsParsed =
          typeof doc.produits === "string"
            ? JSON.parse(doc.produits)
            : doc.produits || [];

        const orderData = {
          $id: doc.$id,
          clientName: doc.clientName ?? "",
          clientEmail: doc.clientEmail ?? "",
          clientNumero: doc.clientNumero ?? "",
          quartier: doc.quartier ?? "",
          total: Number(doc.total) ?? 0,
          produits: produitsParsed,
          paymentStatus: doc.paymentStatus ?? "pending",
          $createdAt: doc.$createdAt
        };

        setOrder(orderData);

        // récupérer les commandes payées
        const paidOrders = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION,
          [
            Query.equal("paymentStatus", "paid"),
            Query.orderAsc("$createdAt"),
            Query.limit(1000)
          ]
        );

        const index = paidOrders.documents.findIndex(
          (o: any) => o.$id === orderId
        );

        if (index !== -1) {
          setPaidIndex(index + 1);
        }

      } catch (error) {

        console.error("Erreur récupération commande :", error);

      } finally {

        setLoading(false);

      }

    };

    if (orderId) fetchOrder();

  }, [orderId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Chargement des détails...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold text-lg">
        Commande introuvable
      </div>
    );
  }

  const orderDate = new Date(order.$createdAt);

  const orderTitle =
    order.paymentStatus === "paid" && paidIndex
      ? `Commande Payée N°${paidIndex}`
      : `Commande ${order.$id}`;

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-8">

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >

        <div>

          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Hash size={22} /> {orderTitle}
          </h1>

          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <Calendar size={16} />
            {orderDate.toLocaleDateString("fr-FR")}
          </p>

          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Clock size={16} />
            {orderDate.toLocaleTimeString("fr-FR")}
          </p>

        </div>

        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" size={16} /> Retour
        </Button>

      </motion.div>


      {/* CLIENT + PAYMENT */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="rounded-2xl shadow-md">

          <CardContent className="p-6 space-y-4">

            <div className="flex items-center gap-2 font-semibold">
              <User size={18} /> Informations client
            </div>

            <p className="text-lg font-bold">{order.clientName}</p>

            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Mail size={14} /> {order.clientEmail}
            </p>

            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Phone size={14} /> {order.clientNumero}
            </p>

            <p className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} /> {order.quartier}
            </p>

          </CardContent>

        </Card>


        <Card className="rounded-2xl shadow-md">

          <CardContent className="p-6 space-y-4">

            <div className="flex items-center gap-2 font-semibold">
              <CreditCard size={18} /> Paiement
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {order.paymentStatus}
            </span>

            <p className="text-2xl font-bold text-blue-600">
              {order.total.toLocaleString("fr-FR")} FCFA
            </p>

          </CardContent>

        </Card>

      </div>


      {/* PRODUITS */}

      {order.produits.length > 0 && (

        <Card className="rounded-2xl shadow-lg">

          <CardContent className="p-6">

            <h2 className="text-xl font-semibold mb-6">
              Produits commandés — {orderTitle}
            </h2>

            {order.produits.map((produit, index) => (

              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border mb-3"
              >

                <div>

                  <p className="font-semibold text-lg">
                    {produit.nom_produit}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantité : {produit.quantite}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    {Number(produit.prix).toLocaleString("fr-FR")} FCFA / unité
                  </p>

                  <p className="font-bold text-gray-800 text-lg">
                    {(produit.quantite * produit.prix).toLocaleString("fr-FR")} FCFA
                  </p>

                </div>

              </div>

            ))}

          </CardContent>

        </Card>

      )}

    </div>
  );
}