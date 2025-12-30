"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // 🔹 Connexion
  const handleLogin = (e: FormEvent) => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u: any) => u.email === loginForm.email && u.password === loginForm.password
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    // 🔹 Redirection directe vers /boutique/dashboard
    router.push("/boutique/dashboard");
  } else {
    alert("Email ou mot de passe incorrect !");
  }
};


  // 🔹 Inscription
  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    if (users.find((u: any) => u.email === signupForm.email)) {
      alert("Cet email est déjà utilisé !");
      return;
    }

    users.push(signupForm);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Inscription réussie !");
    setTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
    
          <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center p-12">
            <h2 className="text-4xl font-extrabold mb-6">
              Bienvenue chez Soma Luxury
            </h2>
            <p className="mb-6 text-gray-200">
              Découvrez nos collections exclusives et luxueuses.
            </p>
            <img
              src="/somaluxury.png"
              alt="Logo Soma Luxury"
              className="w-48 h-48 object-contain opacity-90 mx-auto"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">
          
            <div className="flex justify-center text-black mb-8">
              <Button
                variant={tab === "login" ? "default" : "outline"}
                onClick={() => setTab("login")}
                className="rounded-l-full w-1/2 text-lg"
              >
                Connexion
              </Button>
              <Button
                variant={tab === "signup" ? "default" : "outline"}
                onClick={() => setTab("signup")}
                className="rounded-r-full w-1/2 text-lg"
              >
                Inscription
              </Button>
            </div>

            {/* 🔹 Formulaire de Connexion */}
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6 text-black">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Se connecter
                </Button>
              </form>
            ) : (
              // 🔹 Formulaire d'Inscription
              <form onSubmit={handleSignup} className="space-y-6 text-black">
                <Input
                  type="text"
                  placeholder="Nom"
                  value={signupForm.nom}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, nom: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Prénom"
                  value={signupForm.prenom}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, prenom: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirmation du mot de passe"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  S’inscrire
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
