"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COMMANDE_COLLECTION_ID =
  process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;
const HISTORIQUE_COLLECTION_ID =
  process.env.NEXT_PUBLIC_TABLE_HISTORIQUECOMMANDE_ID!;

export default function ProfilPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/boutique/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);

    loadOrders(currentUser);
  }, []);

  const loadOrders = async (currentUser: any) => {
    try {
      setLoading(true);

      let result;

      try {
        result = await databases.listDocuments(
          DATABASE_ID,
          HISTORIQUE_COLLECTION_ID,
          [Query.equal("email", currentUser.email)]
        );
      } catch {
        result = await databases.listDocuments(
          DATABASE_ID,
          COMMANDE_COLLECTION_ID,
          [Query.equal("email", currentUser.email)]
        );
      }

      setOrders(result.documents || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/boutique/login");
  };

  const totalOrders = orders.length;

  const totalAmount = orders.reduce(
    (sum, item) => sum + Number(item.total || item.prix_total || 0),
    0
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">

          <div className="flex items-center gap-5">
            <img
              src={user.avatar || "/default-avatar.png"}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-200">{user.email}</p>
              <p className="text-sm text-gray-300 mt-1">
                Espace Client Premium
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
          >
            Déconnexion
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3 h-fit">

          <button
            onClick={() => setTab("dashboard")}
            className="w-full text-left border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            📊 Tableau de bord
          </button>

          <button
            onClick={() => setTab("orders")}
            className="w-full text-left border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            📦 Mes commandes
          </button>

          <button
            onClick={() => setTab("settings")}
            className="w-full text-left border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            ⚙️ Paramètres
          </button>

          <button
            onClick={() => router.push("/boutique/favoris")}
            className="w-full text-left border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            ❤️ Favoris
          </button>

          <button
            onClick={() => router.push("/boutique/support")}
            className="w-full text-left border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            💬 Support
          </button>

        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-6">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <>
              <div className="grid md:grid-cols-3 gap-4">

                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-gray-500 text-sm">Total commandes</p>
                  <h2 className="text-3xl font-bold mt-2">
                    {totalOrders}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-gray-500 text-sm">Montant dépensé</p>
                  <h2 className="text-3xl font-bold mt-2">
                    {totalAmount.toLocaleString()} FCFA
                  </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-gray-500 text-sm">Compte</p>
                  <h2 className="text-2xl font-bold mt-2 text-green-600">
                    Actif
                  </h2>
                </div>

              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                  Bienvenue {user.name}
                </h2>

                <p className="text-gray-600 leading-7">
                  Retrouvez ici vos commandes, vos paramètres,
                  votre historique d’achats et vos services client.
                </p>
              </div>
            </>
          )}

          {/* COMMANDES */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-6">
                Historique des commandes
              </h2>

              {loading ? (
                <p>Chargement...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">
                  Aucune commande trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((item: any, index) => (
                    <div
                      key={item.$id}
                      className="border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">
                          Commande #{index + 1}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.$createdAt?.slice(0, 10)}
                        </p>

                        <p className="text-sm mt-1">
                          Statut :
                          <span className="font-semibold ml-1 text-green-600">
                            {item.status || "Confirmée"}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {Number(
                            item.total || item.prix_total || 0
                          ).toLocaleString()}{" "}
                          FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* PARAMETRES */}
          {tab === "settings" && (
            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-6">
                Paramètres du compte
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm text-gray-500">
                    Nom complet
                  </label>
                  <input
                    value={user.name}
                    disabled
                    className="w-full border rounded-xl p-3 mt-1 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Email
                  </label>
                  <input
                    value={user.email}
                    disabled
                    className="w-full border rounded-xl p-3 mt-1 bg-gray-50"
                  />
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Déconnexion
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}