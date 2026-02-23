"use client";

import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const categoriesTableId = process.env.NEXT_PUBLIC_TABLE_CATEGORIES_ID!;
const queryLimit = 1000;

export interface Categorie {
  $id: string;
  nom_categorie: string;       
  subCategories: string[];     
  $createdAt: string;
  $updatedAt: string;
}

export const fetchCategories = async (): Promise<Categorie[]> => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      categoriesTableId,
      [Query.orderDesc("$createdAt"), Query.limit(queryLimit)]
    );

    return response.documents.map((doc) => {
      const data = doc as unknown as Categorie;

      return {
        $id: data.$id,
        nom_categorie: data.nom_categorie,
        subCategories: data.subCategories ?? [], // ⚡ toujours un tableau
        $createdAt: data.$createdAt,
        $updatedAt: data.$updatedAt,
      };
    });
  } catch (error) {
    console.error("Fetch Categorie Error:", error);
    return [];
  }
};
export const addCategorie = async (
  name: string,
  subCategories: string[] = []
) => {
  try {
    return await databases.createDocument(
      databaseId,
      categoriesTableId,
      ID.unique(),
      {
        nom_categorie: name,
        subCategories,
      }
    );
  } catch (error) {
    console.error("Add Categorie Error:", error);
    throw error;
  }
};
export const deleteCategory = async (rowId: string) => {
  try {
    return await databases.deleteDocument(databaseId, categoriesTableId, rowId);
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};
export const updateCategory = async (
  rowId: string,
  data: { nom_categorie?: string; subCategories?: string[] }
) => {
  try {
    return await databases.updateDocument(databaseId, categoriesTableId, rowId, data);
  } catch (error) {
    console.error("Update Error:", error);
    throw error;
  }
};
