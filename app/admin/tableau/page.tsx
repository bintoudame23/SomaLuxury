"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Facture {
  id: number;
  facture: string;
  client: string;
  produit: string;
  quantite: number;
  total: number;
  statutLivraison: "Livré" | "En cours" | "Annulé";
  date: string;
}

const facturesMock: Facture[] = [
  // { id: 1, facture: "12345", client: "Fatou", produit: "Van clef", quantite: 1, total: 2500, statutLivraison: "Livré", date: "2025-12-20" },
];

export default function TableauManager() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const currentMonth = new Date().getMonth(); 

  useEffect(() => {
  
    const facturesMois = facturesMock.filter(
      (f) => new Date(f.date).getMonth() === currentMonth
    );
    setFactures(facturesMois);
  }, []);

  const totalMois = factures.reduce((acc, f) => acc + f.total, 0);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">📋 Tableau des factures (Manager)</h1>
      <Table>
        <TableCaption>Factures du mois en cours.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Facture</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Statut Livraison</TableHead>
            <TableHead className="text-right">Total (FCFA)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factures.length > 0 ? (
            factures.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.facture}</TableCell>
                <TableCell>{f.client}</TableCell>
                <TableCell>{f.produit}</TableCell>
                <TableCell>{f.quantite}</TableCell>
                <TableCell>{f.statutLivraison}</TableCell>
                <TableCell className="text-right">{f.total.toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                Aucune facture ce mois-ci.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="font-bold">Total du mois</TableCell>
            <TableCell className="text-right font-bold">{totalMois.toLocaleString()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
