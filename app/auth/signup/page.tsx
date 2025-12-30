"use client";

import { useState } from "react";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone:"",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", form);
    alert("Inscription réussie !");
    setForm({ name: "", email: "", password: "", phone:"" ,});
  };
 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-gray-500 p-20 rounded-xl shadow-inner w-full max-w-4xl">
      <div className="bg-white w-full rounded-xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 x">
          <div className="flex flex-col items-center justify-center border-r md:border-r-gray-200 pr-0 md:pr-4">
            <h2 className="text-2xl font-semibold mt-4 text-gray-700">
               Espace admin 
            </h2>
            <img
              src="/somaluxury.png"
              alt="SomaLuxury Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
            S'inscrire
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
              >
              Connexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}