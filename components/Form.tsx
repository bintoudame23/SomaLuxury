"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface ProductData {
  name: string;
  price: string;
}

interface FormProps {
  onProductAdded: (product: { id: number; name: string; price: number }) => void;
}

const Form: React.FC<FormProps> = ({ onProductAdded }) => {
  const [data, setData] = useState<ProductData>({ name: "", price: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.name || !data.price) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          price: parseFloat(data.price),
        }),
      });

      if (!response.ok) {
        setError("Erreur lors de l’ajout du produit.");
        return;
      }

      const newProduct = await response.json();
      onProductAdded(newProduct);
      setData({ name: "", price: "" });
      setError("");
    } catch (err) {
      setError("Impossible d’ajouter le produit.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-150 bg-white p-4 rounded-lg shadow-md mb-2"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Ajouter un produit
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Nom du produit"
        className="w-50 p-2 border rounded mb-3 text-black"
      />

      <input
        type="number"
        name="price"
        value={data.price}
        onChange={handleChange}
        placeholder="Prix du produit"
        className="w-50 p-2 border rounded mb-3 text-black"
      />

      <button
        type="submit"
        className="w-35 bg-gray-800 text-white py-2 rounded hover:bg-pink-600 transition"
      >
        Ajouter
      </button>
    </form>
  );
};

export default Form;
