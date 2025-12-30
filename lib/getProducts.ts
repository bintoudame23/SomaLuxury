import { produits } from "./products"; 
import { Produit } from "./types";

export function getProduct(id: number): Produit | undefined {
  const product = produits.find((p) => p.id === id); 
  console.log("Produit reçu ->", product); 
  return product;
}
export const getProductsByCategory = (category: string): Produit[] => {
  const filtered = produits.filter((p) => p.category === category);
  console.log(`Produits pour la catégorie "${category}" ->`, filtered);
  return filtered;
};
