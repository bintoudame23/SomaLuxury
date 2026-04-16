"use client";

import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const produitTableId = process.env.NEXT_PUBLIC_TABLE_PRODUIT_ID!;
const queryLimit = 50;

// 🔹 FETCH
export const fetchProduct = async () => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      produitTableId,
      [Query.limit(queryLimit)]
    );
    return response.documents;
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return [];
  }
};

export const addProduct = async (produitData: any) => {
  try {
    const allowedData: any = {
      nom_produit: produitData.nom_produit,
      description: produitData.description,
      prix: produitData.prix,
      quantite: produitData.quantite,

      // ✅ FIX ICI : toujours un tableau
      couleur: Array.isArray(produitData.couleur)
        ? produitData.couleur
        : produitData.couleur
        ? [produitData.couleur]
        : [],

      categorie: produitData.categorie,
      images: produitData.images || [],
      videos: produitData.videos || [],
    };

    if (produitData.subCategorie) {
      allowedData.subCategorie = produitData.subCategorie;
    }

    const response = await databases.createDocument(
      databaseId,
      produitTableId,
      ID.unique(),
      allowedData
    );

    console.log("Produit ajouté avec succès!", response);
    return response;
  } catch (error) {
    console.error("Add Product Error:", error);
    throw error;
  }
};

export const updateProduct = async (rowId: string, data: any) => {
  try {
    const allowedData: any = {
      nom_produit: data.nom_produit,
      description: data.description,
      prix: data.prix,
      quantite: data.quantite,

      couleur: Array.isArray(data.couleur)
        ? data.couleur
        : data.couleur
        ? [data.couleur]
        : [],

      categorie: data.categorie,
      images: data.images || [],
      videos: data.videos || [],
    };

    if (data.subCategorie) {
      allowedData.subCategorie = data.subCategorie;
    }

    const response = await databases.updateDocument(
      databaseId,
      produitTableId,
      rowId,
      allowedData
    );

    return response;
  } catch (error) {
    console.error("Update Product Error:", error);
    throw error;
  }
};

export const deleteProduct = async (rowId: string) => {
  try {
    await databases.deleteDocument(databaseId, produitTableId, rowId);
    return true;
  } catch (error) {
    console.error("Delete Product Error:", error);
    return false;
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await databases.getDocument(
      databaseId,
      produitTableId,
      id
    );
    return product;
  } catch (error) {
    console.error("Erreur récupération produit :", error);
    return null;
  }
};