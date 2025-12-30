"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/action/loginAction";

interface Login {
  email: string;
  password: string;
}
export default function Login() {
  const [loginData, setLoginData] = useState<Login>({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   alert(`Connexion réussie pour ${loginData.email}`);
  //   setLoginData({ email: "", password: "" });
  //   router.push("/admin/dashboard");
  // };

  const [state, formAction] = useActionState(login, undefined)

  return (
 <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-gray-500 p-20 rounded-xl shadow-inner w-full max-w-4xl">
      <div className="bg-white w-full rounded-xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 x">
          <div className="flex flex-col items-center justify-center border-r md:border-r-gray-200 pr-0 md:pr-4">
            <h2 className="login-title text-gray-800 ">Espace admin Connexion</h2>
            <img
              src="/somaluxury.png"
              alt="SomaLuxury Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
           
            </h2>
      <form action={formAction} className="login-form">
        <input
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          className="login-input"
        />
        {state?.errors?.email && <span className="text-red-500">{state.errors.email}</span>}
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={loginData.password}
          onChange={handleChange}
          className="login-input"
        />
        {state?.errors?.password && <span className="text-red-500">{state.errors.password}</span>}
        <button type="submit" className="login-button">
          Se connecter
        </button>
      </form>
      <span className="text-red-500">{state?.error}</span>
       <div className="mt-8 bg-black p-6 rounded-2xl text-sm">
          <h2 className="font-semibold mb-2 text-yellow-400">📘 Règles d'utilisation</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Identifiants hautement confidentiels.</li>
            <li>Utiliser un mot de passe complexe.</li>
            <li>Toutes les actions sont enregistrées.</li>
            <li>Accès exclusivement réservé au staff SomaLuxury.</li>
            <li>En cas de suspicion, contacter la direction immédiatement.</li>
          </ul>
          </div>
        <p className="text-xs mt-6 text-center text-gray-800">
          © {new Date().getFullYear()} — SomaLuxury Administration
        </p>
           </div>
          </div>
        </div>
      </div>
    </div>
);
}

