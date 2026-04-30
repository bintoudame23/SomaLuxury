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
      const userId = currentUser?.$id || currentUser?.id || "";
      const userEmail =
        currentUser?.email?.trim()?.toLowerCase() || "";

      let result;

      /* recherche principale */
      if (userId) {
        result = await databases.listDocuments(
          DATABASE_ID,
          COMMANDE_COLLECTION_ID,
          [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );
      } else {
        result = await databases.listDocuments(
          DATABASE_ID,
          COMMANDE_COLLECTION_ID,
          [
            Query.equal("clientEmail", userEmail),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );
      }

      let docs = result.documents || [];

      /* fallback si userId vide en base */
      if (docs.length === 0 && userEmail) {
        const fallback =
          await databases.listDocuments(
            DATABASE_ID,
            COMMANDE_COLLECTION_ID,
            [
              Query.equal(
                "clientEmail",
                userEmail
              ),
              Query.orderDesc("$createdAt"),
              Query.limit(100),
            ]
          );

        docs = fallback.documents || [];
      }

      setOrders(docs);
    } catch (error) {
      console.error(
        "Erreur chargement commandes :",
        error
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/boutique/login");
  };

  const totalOrders = orders.length;

  const totalAmount = orders.reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

  const latestOrder = orders[0];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={
                user.avatar ||
                "/avatar.png"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>

              <p className="text-gray-200">
                {user.email}
              </p>

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
        {/* MENU */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3 h-fit">
          <button
            onClick={() =>
              setTab("dashboard")
            }
            className="w-full text-left border rounded-xl px-4 py-3"
          >
            📊 Tableau de bord
          </button>

          <button
            onClick={() =>
              setTab("orders")
            }
            className="w-full text-left border rounded-xl px-4 py-3"
          >
            📦 Mes commandes
          </button>

          <button
            onClick={() =>
              setTab("settings")
            }
            className="w-full text-left border rounded-xl px-4 py-3"
          >
            ⚙️ Paramètres
          </button>
        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-6">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-sm text-gray-500">
                    Total commandes
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {totalOrders}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-sm text-gray-500">
                    Montant dépensé
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {totalAmount.toLocaleString()}{" "}
                    FCFA
                  </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-5">
                  <p className="text-sm text-gray-500">
                    Compte
                  </p>
                  <h2 className="text-2xl font-bold mt-2 text-green-600">
                    Actif
                  </h2>
                </div>
              </div>

              {latestOrder && (
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Dernière commande
                  </h2>

                  <p>
                    ID :{" "}
                    {latestOrder.$id}
                  </p>

                  <p className="mt-2">
                    Date :{" "}
                    {new Date(
                      latestOrder.$createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-2 font-bold text-pink-600">
                    {Number(
                      latestOrder.total ||
                        0
                    ).toLocaleString()}{" "}
                    FCFA
                  </p>
                </div>
              )}
            </>
          )}

          {/* COMMANDES */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Mes commandes
              </h2>

              {loading ? (
                <p>
                  Chargement...
                </p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">
                  Aucune commande trouvée.
                </p>
              ) : (
                orders.map(
                  (
                    item: any,
                    index
                  ) => (
                    <div
                      key={
                        item.$id
                      }
                      className="border rounded-2xl p-5 mb-4"
                    >
                      <div className="flex justify-between flex-col md:flex-row gap-4">
                        <div>
                          <p className="font-bold">
                            Commande #
                            {index +
                              1}
                          </p>

                          <p className="text-sm text-gray-500">
                            ID :{" "}
                            {
                              item.$id
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            Date :{" "}
                            {new Date(
                              item.$createdAt
                            ).toLocaleString()}
                          </p>

                          <p className="text-sm mt-1">
                            Quartier :{" "}
                            {item.quartier ||
                              "-"}
                          </p>

                          <p className="text-sm">
                            Téléphone :{" "}
                            {item.clientNumero ||
                              "-"}
                          </p>

                          <p className="text-sm">
                            Adresse :{" "}
                            {item.shippingAddresse ||
                              "-"}
                          </p>

                          <p className="text-sm">
                            Statut :{" "}
                            <span className="font-semibold text-green-600">
                              {item.paymentStatus ||
                                "pending"}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-pink-600">
                            {Number(
                              item.total ||
                                0
                            ).toLocaleString()}{" "}
                            FCFA
                          </p>
                        </div>
                      </div>

                      {/* produits */}
                      {item.produits && (
                        <div className="mt-4 border-t pt-4">
                          <p className="font-semibold mb-2">
                            Produits :
                          </p>

                          {JSON.parse(
                            item.produits
                          ).map(
                            (
                              prod: any,
                              i: number
                            ) => (
                              <div
                                key={
                                  i
                                }
                                className="text-sm text-gray-700 mb-2"
                              >
                                •{" "}
                                {
                                  prod.nom_produit
                                }{" "}
                                ×{" "}
                                {
                                  prod.quantite
                                }{" "}
                                —{" "}
                                {Number(
                                  prod.prix
                                ).toLocaleString()}{" "}
                                FCFA
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Paramètres
              </h2>

              <input
                value={user.name}
                disabled
                className="w-full border rounded-xl p-3 mb-3"
              />

              <input
                value={user.email}
                disabled
                className="w-full border rounded-xl p-3 mb-3"
              />

              <input
                value={
                  user.$id
                }
                disabled
                className="w-full border rounded-xl p-3 mb-3"
              />

              <button
                onClick={
                  handleLogout
                }
                className="bg-red-500 text-white px-5 py-3 rounded-xl"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}