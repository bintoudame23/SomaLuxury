"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const UTILISATEUR_COLLECTION_ID =
  process.env.NEXT_PUBLIC_TABLE_UTILISATEUR_ID!;

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
      REGISTER
  ========================= */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      return alert("Veuillez remplir tous les champs.");
    }

    try {
      setLoading(true);

      let existingUsers: any = null;

      try {
        existingUsers = await databases.listDocuments(
          DATABASE_ID,
          UTILISATEUR_COLLECTION_ID
        );
      } catch (err) {
        console.warn("Appwrite list fallback mode");
      }

      const emailExists = existingUsers?.documents?.some(
        (u: any) =>
          String(u.email || "").trim().toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (emailExists) {
        alert("Cet email existe déjà.");
        setLoading(false);
        return;
      }

      const user = await databases.createDocument(
        DATABASE_ID,
        UTILISATEUR_COLLECTION_ID,
        ID.unique(),
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          avatar: "/default-avatar.png",
        }
      );

      localStorage.setItem("user", JSON.stringify(user));

      alert("Compte créé avec succès !");
      router.push("/boutique/profil");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      LOGIN
  ========================= */
  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Veuillez remplir email et mot de passe.");
    }

    try {
      setLoading(true);

      let res: any = null;

      try {
        res = await databases.listDocuments(
          DATABASE_ID,
          UTILISATEUR_COLLECTION_ID
        );
      } catch (err) {
        console.warn("Query fallback mode");
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const user = res?.documents?.find(
        (u: any) =>
          String(u.email || "").trim().toLowerCase() === cleanEmail &&
          String(u.password || "").trim() === cleanPassword
      );

      if (!user) {
        alert("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      alert("Connexion réussie !");
      router.push("/boutique/profil");
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border">

        <div className="text-center mb-8">
          <img src="/somaluxury.png" className="h-16 mx-auto mb-4" />

          <h1 className="text-3xl font-bold">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h1>

          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Connectez-vous à votre espace client"
              : "Inscrivez-vous pour commander facilement"}
          </p>
        </div>

        {!isLogin && (
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-2xl p-3 mb-4"
          />
        )}

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-2xl p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-2xl p-3 mb-5"
        />

        <button
          disabled={loading}
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-black text-white rounded-2xl p-3 font-semibold"
        >
          {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
        </button>

        <div className="text-center mt-6 text-sm text-gray-500">
          {isLogin
            ? "Vous n'avez pas de compte ?"
            : "Vous avez déjà un compte ?"}
        </div>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-3 text-pink-600 font-semibold"
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>

      </div>
    </div>
  );
}