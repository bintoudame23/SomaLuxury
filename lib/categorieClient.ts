import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const categoriesTableId = process.env.NEXT_PUBLIC_TABLE_CATEGORIES_ID!;
const queryLimit = 10;

export interface categorie {
    
   $id: string;
  nom_categorie: string;
  $createdAt: string;
  $updatedAt: string;
}

export const fetchCategories = async () => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      categoriesTableId,
      [Query.orderDesc("$createdAt"), Query.limit(queryLimit)]
    );
    return response.documents;
  } catch (error) {
    console.log("Fetch Categorie Error:", error);
  }
};

export const addCategorie = async (name: string) => {
  try {
    return await databases.createDocument(
      databaseId,
      categoriesTableId,
      ID.unique(),
      { nom_categorie: name },
    );
  } catch (error) {
    console.log("Add Categorie Error:", error);
  }
};

export const deleteCategory = async (rowId: string) => {
  try {
    return await databases.deleteDocument(
      databaseId,
      categoriesTableId,
      rowId
    );
  } catch (error) {
    console.log("Delete Error:", error);
  }
};

export const updateCategory = async (rowId: string, name: string) => {
  try {
    return await databases.updateDocument(
      databaseId,
      categoriesTableId,
      rowId,
      { nom_categorie: name }
    );
  } catch (error) {
    console.log("Update Error:", error);
    throw error;
  }
};
