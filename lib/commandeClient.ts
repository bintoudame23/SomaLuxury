"use client"
import { ID, Query} from "appwrite";
import { databases } from "@/lib/appwrite"; // import databases

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const commandeTableId = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;

const queryLimit = 10;

export const fetchCommande = async () => {
    try {
    
        const response = await databases.listDocuments(
            databaseId,
            commandeTableId,
            [Query.orderDesc("$createdAt"), Query.limit(queryLimit)]
        );
        return response.documents; 
    } catch (error) {
        console.log("Fetch commande Error:", error);
    }
};

export const addCommande = async (name: string) => {
    try {
        const response = await databases.createDocument(
            databaseId,
           commandeTableId,
            ID.unique(),
            { },
    
        );
        console.log("succès!", response);
    } catch (error) {
        console.log("Error:", error);
    }
};


