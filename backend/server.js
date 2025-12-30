
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let produits = [];

app.get("/api/products", (req, res) => {
  res.json(produits);
});
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const produit = produits.find((p) => p.id == id); // == car id peut être string ou number
  if (!produit) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }
  res.json(produit);
});


app.post("/api/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  produits.push(newProduct);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  const index = produits.findIndex((p) => p.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  produits[index] = { ...produits[index], name, price, image };
  res.json(produits[index]);
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);
