"use client";

import { createCommande } from "@/lib/createCommande";
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
  name: string;
  prenom: string;
  email: string;
  adresse: string;
  numero: string;
}

export default function PanierPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ClientForm>({
    name: "",
    prenom: "",
    email: "",
    adresse: "",
    numero: "",
  });

  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

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
      quartiers: [
        "Dalifort",
        "Ann Bel-Air",
        "Niayes",
        "Guinaw Rails",
        "Tally",
      ],
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

  useEffect(() => {
    const saved = localStorage.getItem("cart");

    if (saved) {
      const parsed = JSON.parse(saved).map((item: any) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));

      setCart(parsed);
    }
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal + deliveryFee;

  const handleZoneChange = (value: string) => {
    setDeliveryZone(value);

    const zone = Object.values(zones).find((z) =>
      z.quartiers.includes(value)
    );

    setDeliveryFee(zone ? zone.tarif : 0);
  };

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity + delta),
          }
        : item
    );

    updateCart(updated);
  };

  const handleRemoveFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart.length) {
      alert("Votre panier est vide !");
      return;
    }

    if (!deliveryZone) {
      alert("Veuillez sélectionner votre quartier !");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);

    const produitsCommande = JSON.stringify(
      cart.map((item) => ({
        id: item.id,
        nom_produit: item.name,
        prix: item.price,
        quantite: item.quantity,
      }))
    );

    /* IMPORTANT :
       Appwrite demande userId obligatoire
       Ici on génère un ID unique automatique
    */
    const userId = crypto.randomUUID();

    const Data = {
      userId: userId,
      clientName: `${form.prenom} ${form.name}`,
      clientEmail: form.email,
      shippingAddresse: form.adresse,
      clientNumero: form.numero,
      quartier: deliveryZone,
      fraisLivraison: deliveryFee,
      total: total,
      produits: produitsCommande,
      paymentStatus: "pending",
      date: new Date().toISOString(),
    };

    try {
      await createCommande(Data);

      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Erreur création commande:", error);
      alert("❌ Erreur lors de l'envoi de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white py-20">
        <h2 className="text-3xl font-bold text-green-600 mb-6">
          ✅ Commande passée avec succès !
        </h2>

        <p className="mb-6 text-gray-700">
          Merci pour votre commande.
        </p>

        <Button
          onClick={() => router.push("/boutique/dashboard")}
          className="bg-pink-600 text-white"
        >
          Retour au Dashboard
        </Button>
      </div>
    );
  }

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
                        onClick={() =>
                          handleQuantityChange(item.id, -1)
                        }
                      >
                        -
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(item.id, 1)
                        }
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleRemoveFromCart(item.id)
                      }
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}

                <div className="text-right mt-5 space-y-1">
                  <p>
                    Sous-total : {subtotal.toLocaleString()} FCFA
                  </p>

                  <p>
                    Livraison : {deliveryFee.toLocaleString()} FCFA
                  </p>

                  <p className="font-bold text-lg text-pink-600">
                    Total : {total.toLocaleString()} FCFA
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-4"
                >
                  <div>
                    <Label>Quartier</Label>

                    <Select
                      value={deliveryZone}
                      onValueChange={handleZoneChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir quartier" />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.entries(zones).map(
                          ([zone, data]: any) => (
                            <SelectGroup key={zone}>
                              <SelectLabel>
                                {zone}
                              </SelectLabel>

                              {data.quartiers.map(
                                (q: string) => (
                                  <SelectItem
                                    key={q}
                                    value={q}
                                  >
                                    {q} ({data.tarif} FCFA)
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      [
                        "prenom",
                        "name",
                        "email",
                        "adresse",
                        "numero",
                      ] as const
                    ).map((field) => (
                      <div key={field}>
                        <Label>{field}</Label>

                        <Input
                          required
                          value={form[field]}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 text-white"
                  >
                    {loading
                      ? "Envoi en cours..."
                      : "Valider la commande"}
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