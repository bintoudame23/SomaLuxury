"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Produit {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Client {
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  numero: string;
}

interface Livraison {
  quartier: string;
  frais: number;
}

interface RecapData {
  produits: Produit[];
  client: Client;
  livraison: Livraison;
  totalProduits: number;
  totalGeneral: number;
  dateCommande?: string;
}

const Recapitulatif: React.FC = () => {
  const [recap, setRecap] = useState<RecapData | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("recapData");

      if (data) {
        const parsed: RecapData = JSON.parse(data);
        if (parsed.produits && parsed.produits.length > 0) {
          parsed.dateCommande = new Date().toLocaleString(); 
          setRecap(parsed);
        }
      }
    } 
    catch (error) {
      console.error("Erreur lors du chargement du récapitulatif :", error);
      setRecap(null);
    }
  }, []);
useEffect(() => {
  if (recap) {
    const sendCommande = async () => {
      try {
        const res = await fetch("/api/admin/commande", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recap), 
        });

        const data = await res.json();
        console.log("📤 Réponse API :", data);

        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de l'envoi de la commande");
        }
      } catch (error) {
        console.error("❌ Erreur fetch :", error);
      }
    };

    sendCommande();
  }
}, [recap]);



  if (!recap) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">Aucune commande récente trouvée.</p>
        <Link
          href="/boutique/dashboard"
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }
  const { produits, client, livraison, totalProduits, totalGeneral } = recap;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          ✅ Récapitulatif de votre commande
        </h2>
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-lg text-gray-700">
            👤 Informations Client
          </h3>
          <div className="text-gray-700">
            <p>
              {client.prenom} {client.nom} — {client.email}
            </p>
            <p>
              📍 {client.adresse} ({livraison.quartier})
            </p>
            <p>📞 {client.numero}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">
            🛍️ Produits commandés
          </h3>
          {produits.map((p, i) => (
            <div
              key={p.id ?? i}
              className="flex justify-between border-b py-2 text-gray-700"
            >
              <span>
                {p.name} (x{p.quantity || 1})
              </span>
              <span>
                {(p.price * (p.quantity || 1)).toLocaleString()} FCFA
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right text-gray-700 space-y-2">
          <p>Sous-total : {totalProduits.toLocaleString()} FCFA</p>
          <p>
            Livraison ({livraison.quartier}) :{" "}
            {livraison.frais.toLocaleString()} FCFA
          </p>
          <p className="text-lg font-bold text-pink-600">
            Total à payer : {totalGeneral.toLocaleString()} FCFA
          </p>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/boutique/dashboard"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md font-semibold"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Recapitulatif;
