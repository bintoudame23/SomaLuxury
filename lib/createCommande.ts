import { ID, Query} from "appwrite";
import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_TABLE_COMMANDE_ID!;

export const createCommande = async (commande: {
  clientName: string;
  clientEmail: string;
  produits: any[];
  shippingAddresse: string;
  clientNumero:string;
  fraisLivraison: number;
  listCommande:any[];
  paymentStatus:string;
  total: number;
}) => databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    {
        ...commande,
        statut: "en_attente",
        createdAt: new Date().toISOString()
    }
);
