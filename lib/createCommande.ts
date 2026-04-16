import { databases } from "./appwrite";
import { ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COMMANDES_COLLECTION_ID = "commandes";

export const createCommande = async (data: any) => {
  return await databases.createDocument(
    DATABASE_ID,
    COMMANDES_COLLECTION_ID,
    ID.unique(),
    data
  );
};