"use client";

import { useEffect, useState, useMemo } from "react";
import { databases, Query } from "@/lib/appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;

export default function CommandesStatsPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const [showAll, setShowAll] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION,
        [
          Query.equal("paymentStatus", "paid"),
          Query.orderDesc("$createdAt"),
          Query.limit(1000),
        ]
      );

      setOrders(res.documents);
      setFilteredOrders(res.documents);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    // filtre mois
    if (selectedMonth !== "all") {
      result = result.filter(
        (o) => new Date(o.$createdAt).getMonth() === parseInt(selectedMonth)
      );
    }

    const now = new Date();

    if (dateFilter === "today") {
      result = result.filter((o) => {
        const d = new Date(o.$createdAt);
        return d.toDateString() === now.toDateString();
      });
    }

    if (dateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      result = result.filter((o) => {
        const d = new Date(o.$createdAt);
        return d.toDateString() === yesterday.toDateString();
      });
    }

    if (dateFilter === "7days") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);

      result = result.filter((o) => new Date(o.$createdAt) >= last7);
    }

    if (dateFilter === "30days") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);

      result = result.filter((o) => new Date(o.$createdAt) >= last30);
    }

    setFilteredOrders(result);
  }, [selectedMonth, dateFilter, orders]);

  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders]
  );

  const avgOrder = useMemo(() => {
    if (filteredOrders.length === 0) return 0;
    return totalRevenue / filteredOrders.length;
  }, [filteredOrders]);

  const thisMonthOrders = useMemo(() => {
    const month = new Date().getMonth();

    return orders.filter(
      (o) => new Date(o.$createdAt).getMonth() === month
    ).length;
  }, [orders]);

  const ordersRevenueData = useMemo(() => {
    const map: Record<string, { orders: number; revenue: number }> = {};

    filteredOrders.forEach((o) => {
      const date = o.$createdAt.split("T")[0];

      if (!map[date]) map[date] = { orders: 0, revenue: 0 };

      map[date].orders += 1;
      map[date].revenue += o.total || 0;
    });

    return Object.keys(map)
      .sort()
      .map((date) => ({ date, ...map[date] }));
  }, [filteredOrders]);

  if (loading) return <p className="p-6">Chargement...</p>;

  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 5);

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        📊 Dashboard des ventes
      </motion.h1>

      {/* FILTRES */}

      <div className="flex flex-wrap gap-4 items-center">

        <div>
          <label className="font-semibold mr-2">Mois :</label>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 rounded-lg border bg-white"
          >
            <option value="all">Tous</option>

            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Date :</label>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 rounded-lg border bg-white"
          >
            <option value="all">Tous</option>
            <option value="today">Aujourd'hui</option>
            <option value="yesterday">Hier</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
          </select>
        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="rounded-2xl shadow-lg p-4">
          <CardContent>
            <p className="text-sm text-gray-500">Total commandes</p>
            <p className="text-3xl font-bold">{filteredOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg p-4">
          <CardContent>
            <p className="text-sm text-gray-500">Revenu total</p>
            <p className="text-3xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg p-4">
          <CardContent>
            <p className="text-sm text-gray-500">Commandes ce mois</p>
            <p className="text-3xl font-bold">{thisMonthOrders}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg p-4">
          <CardContent>
            <p className="text-sm text-gray-500">Panier moyen</p>
            <p className="text-3xl font-bold">
              {Math.round(avgOrder).toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>

      </div>

      {/* GRAPHIQUE */}

      <Card className="rounded-2xl shadow-lg p-6">

        <CardContent>

          <h2 className="font-semibold mb-4 text-lg">
            Evolution ventes
          </h2>

          <ResponsiveContainer width="100%" height={500}>

            <LineChart data={ordersRevenueData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="orders"
                stroke="#f97316"
                strokeWidth={3}
                name="Commandes"
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={3}
                name="Revenus"
              />

            </LineChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

      {/* COMMANDES */}

      <Card className="rounded-2xl shadow-lg bg-white">

        <CardContent className="p-6">

          <h2 className="font-semibold mb-4 text-lg">
            Commandes payées
          </h2>

          <div className="space-y-3">

            {displayedOrders.map((order, index) => {

              const orderNumber = filteredOrders.length - index;

              return (

                <motion.div
                  key={order.$id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center border p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/stats/${order.$id}`)
                  }
                >

                  <div>

                    <p className="font-semibold">
                      Commande N°{orderNumber}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(order.$createdAt).toLocaleString()}
                    </p>

                  </div>

                  <p className="font-bold text-lg text-green-600">
                    {order.total.toLocaleString()} FCFA
                  </p>

                </motion.div>

              );

            })}

          </div>

          {filteredOrders.length > 5 && (

            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => setShowAll(!showAll)}
            >

              {showAll ? "Afficher moins" : "Afficher plus"}

            </button>

          )}

        </CardContent>

      </Card>

    </div>
  );
}