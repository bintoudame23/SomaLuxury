"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 900 },
  { month: "Apr", value: 1600 },
  { month: "May", value: 2000 },
  { month: "Jun", value: 2500 },
];

const ordersData = [
  { category: "Produits", count: 120 },
  { category: "Commandes", count: 300 },
  { category: "Clients", count: 150 },
  { category: "Retours", count: 20 },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">

      {/* Titre */}
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <p className="text-gray-500">
        Analyse complète des ventes, commandes et rapports mensuels.
      </p>

      {/* Cartes Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ventes totales</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">4 300 000 CFA</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">980</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients actifs</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">340</CardContent>
        </Card>
      </div>

      {/* Graphique Ligne */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des ventes (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="blue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des catégories</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="green" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports détaillés</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">Rapport</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-2">Rapport mensuel des ventes</td>
                <td className="p-2 text-green-600 font-semibold">Terminé</td>
                <td className="p-2">01 Jan 2025</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">Rapport commandes</td>
                <td className="p-2 text-yellow-600 font-semibold">En cours</td>
                <td className="p-2">05 Jan 2025</td>
              </tr>

              <tr>
                <td className="p-2">Rapport clients</td>
                <td className="p-2 text-red-600 font-semibold">En attente</td>
                <td className="p-2">10 Jan 2025</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
