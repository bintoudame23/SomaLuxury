"use client"
import { ID, Query, type Models } from "appwrite";
import { client, account, databases } from "@/lib/appwrite"; // import databases

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const produitTableId = process.env.NEXT_PUBLIC_TABLE_PRODUIT_ID!;

const queryLimit = 10;

export const fetchProduct = async () => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            produitTableId,
            [Query.orderDesc("$createdAt"), Query.limit(queryLimit)]
        );
        return response.documents; 
    } catch (error) {
        console.log("Fetch Product Error:", error);
    }
};
export const addProduct = async () => {
    try {
        const response = await databases.createDocument(
            databaseId,
            produitTableId,
            ID.unique(),
          {}
        );
        console.log("Produit ajouté avec succès!", response);
    } catch (error) {
        console.log("Add Product Error:", error);
    }
};
  export const updateProduct = async (rowId: string, name: string) => {
    try {
        const response = await databases.updateDocument(databaseId,produitTableId, rowId,{ nom_categorie: name }
        );
        return response;
    } catch (error) {
        console.log("Update Error:", error);
    }
    }
     export const deleteProduct = async (rowId: string) => {
        try {
            const response = await databases.deleteDocument( databaseId,produitTableId,rowId);
            return response;
        } catch (error) {
            console.log(error);
        }
    };
