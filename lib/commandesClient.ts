import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID;

if (!DATABASE_ID || !COLLECTION_ID) {
  throw new Error("Variables Appwrite manquantes : DATABASE_ID ou TABLE_COMMANDE_ID");
}

export const fetchOrders = async () => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID
  );

  return response.documents;
};
