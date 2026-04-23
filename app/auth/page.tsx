"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Admin {
  id: number;
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminUsers, setAdminUsers] = useState<Admin[]>([]);
  const [email, setEmail] = useState("fasylla2003@gmail.com");
  const [password, setPassword] = useState("bintou23");
  const [loading, setLoading] = useState(true);

  // ✅ FIX localStorage SAFE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminUsers");

      if (stored) {
        setAdminUsers(JSON.parse(stored));
      } else {
        const defaultAdmin: Admin[] = [
          { id: 1, email: "fasylla2003@gmail.com", password: "bintou23" },
        ];

        localStorage.setItem("adminUsers", JSON.stringify(defaultAdmin));
        setAdminUsers(defaultAdmin);
      }

      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const admin = adminUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!admin) {
      alert("Identifiants incorrects !");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("currentAdmin", JSON.stringify(admin));
    }

    router.push("/admin/dashboard");
  };

  // 🔥 éviter affichage avant chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-white"
      >
        {/* Logo + titre */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/somaluxury.png"
            alt="SomaLuxury Logo"
            className="w-48 h-48 mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-center tracking-wider">
            Espace Admin • SomaLuxury
          </h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 text-center mb-8">
          Accès strictement réservé aux administrateurs certifiés. <br />
          Les connexions sont surveillées et journalisées.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Adresse e-mail administrateur"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />

          <button
            type="submit"
            className="w-full p-4 rounded-2xl bg-yellow-500 hover:bg-yellow-600 transition font-semibold shadow-xl text-black"
          >
            Connexion Admin
          </button>
        </form>

        {/* Règles */}
        <div className="mt-8 bg-black/30 p-6 rounded-2xl text-sm">
          <h2 className="font-semibold mb-2 text-yellow-400">
            📘 Règles d'utilisation
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Identifiants hautement confidentiels.</li>
            <li>Utiliser un mot de passe complexe.</li>
            <li>Toutes les actions sont enregistrées.</li>
            <li>Accès exclusivement réservé au staff SomaLuxury.</li>
            <li>En cas de suspicion, contacter la direction immédiatement.</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs mt-6 text-center text-gray-400">
          © {new Date().getFullYear()} — SomaLuxury Administration
        </p>
      </motion.div>
    </div>
  );
}