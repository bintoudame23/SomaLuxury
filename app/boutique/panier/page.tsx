"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CartItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface ClientForm {
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  numero: string;
}

export default function PanierPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<ClientForm>({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    numero: "",
  });

  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const zones = {
    "Zones Parcelles Assainies / Libertés": {
      quartiers: [
        "Parcelles Assainies",
        "Soprim",
        "Grand Medine",
        "Grand Yoff",
        "Cambérène",
        "Golf-sud",
      ],
      tarif: 2000,
    },
    Guediawaye: {
      quartiers: [
        "Golf Nord",
        "Cité Enseignant",
        "Ndiarème-Limamoulaye",
        "Wakhinane Nimzatt",
        "Sam Notaire",
        "Médina-Gounass",
      ],
      tarif: 2500,
    },
    Pikine: {
      quartiers: ["Dalifort", "Ann Bel-Air", "Niayes", "Guinaw Rails", "Tally"],
      tarif: 3000,
    },
    "Zones Almadies / Corniche Ouest": {
      quartiers: ["Almadies", "Ngor", "Ouakam", "Yoff", "Plateau"],
      tarif: 3000,
    },
    "Zones Centre-ville": {
      quartiers: [
        "Médina",
        "Colobane",
        "Fass",
        "Liberté 1",
        "Liberté 2",
        "Liberté 3",
        "Liberté 4",
        "Liberté 5",
        "HLM Plateau",
        "Grand Dakar",
        "Point E",
        "Fann",
        "Mermoz",
      ],
      tarif: 3000,
    },
    "Zone éloignée": {
      quartiers: [
        "Rufisque Centre",
        "Thiaroye",
        "Sangalkam",
        "Bargny",
        "Jaxaay",
        "Grand Mbao",
        "Mbao",
        "Keur Massar",
        "Keur Mbaye Fall",
      ],
      tarif: 5000,
    },
  };

  // ---------------------- LOAD CART -----------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }));
        setCart(parsed);
      }
    } catch (error) {
      console.error("Erreur localStorage:", error);
    }
  }, []);

  // ---------------------- QUANTITY -----------------------
  const handleQuantityChange = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const quantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ---------------------- REMOVE ITEM -----------------------
  const handleRemoveFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ---------------------- TOTALS -----------------------
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  // ---------------------- HANDLE ZONE -----------------------
  const handleZoneChange = (value: string) => {
    setDeliveryZone(value);
    for (const data of Object.values(zones)) {
      if (data.quartiers.includes(value)) {
        setDeliveryFee(data.tarif);
        break;
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return alert("Votre panier est vide !");
    if (!deliveryZone) return alert("Veuillez sélectionner votre quartier !");

  
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return alert("Veuillez entrer un email valide.");
    }

    const recapData = {
      produits: cart,
      client: form,
      livraison: { quartier: deliveryZone, frais: deliveryFee },
      totalProduits: subtotal,
      totalGeneral: total,
      dateCommande: new Date().toLocaleString(),
    };

    localStorage.setItem("recapData", JSON.stringify(recapData));
    router.push("/boutique/recapitulatif");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto py-10">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Votre Panier
            </CardTitle>
          </CardHeader>

          <CardContent>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">
                Votre panier est vide.
              </p>
            ) : (
              <>
                {/* ---------------------- CART LIST ----------------------- */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/default.jpg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-500">
                          {item.price.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        –
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}

                {/* ---------------------- TOTALS ----------------------- */}
                <div className="text-right mt-5 space-y-1">
                  <p>Sous-total : {subtotal.toLocaleString()} FCFA</p>
                  <p>Livraison : {deliveryFee.toLocaleString()} FCFA</p>
                  <p className="font-bold text-lg text-pink-600">
                    Total : {total.toLocaleString()} FCFA
                  </p>
                </div>

                {/* ---------------------- FORMULAIRE ----------------------- */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Quartier */}
                  <div>
                    <Label>Quartier :</Label>
                    <Select value={deliveryZone} onValueChange={handleZoneChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Sélectionnez --" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(zones).map(([zone, data]) => (
                          <SelectGroup key={zone}>
                            <SelectLabel>{zone}</SelectLabel>
                            {data.quartiers.map((q) => (
                              <SelectItem key={`${zone}-${q}`} value={q}>
                                {q} ({data.tarif} FCFA)
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Champs client */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["prenom", "nom", "email", "adresse", "numero"].map((field) => (
                      <div key={field}>
                        <Label htmlFor={field}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Label>
                        <Input
                          id={field}
                          name={field}
                          placeholder={field}
                          required
                          onChange={(e) =>
                            setForm({ ...form, [field]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                  >
                    Valider la commande
                  </Button>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter />
        </Card>
      </div>
    </div>
  );
}
