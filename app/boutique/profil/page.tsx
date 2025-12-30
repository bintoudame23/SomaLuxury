"use client";
import React from "react";
import Header from "../../components/Header";
import Link from "next/link";

export default function ProfilPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
        <Link href="/login" className="text-pink-600 underline">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Profil de {user.nom}
        </h2>
        <p className="text-gray-600 mb-6">Email : {user.email}</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Historique des commandes :
        </h3>
        {user.commandes && user.commandes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {user.commandes.map((cmd) => (
              <li key={cmd.id} className="py-3 flex justify-between">
                <span>Commande du {cmd.date}</span>
                <span className="font-medium">{cmd.total} FCFA</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">
            Aucune commande enregistrée pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
