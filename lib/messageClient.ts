import { databases, Query } from "./appwrite";
import { ID } from "node-appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_MESSAGES_ID!;

/**
 * 📩 Créer un message
 */
export const createMessage = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "Unread" | "Read";
  date?: string;
}) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        ...data,
        status: data.status || "Unread",
        date: data.date || new Date().toLocaleString(),
      }
    );
  } catch (error) {
    console.error("❌ Erreur createMessage:", error);
    throw error;
  }
};

/**
 * 📥 Récupérer tous les messages
 */
export const getMessages = async () => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return res.documents;
  } catch (error) {
    console.error("❌ Erreur getMessages:", error);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour un message (réponse, status, etc.)
 */
export const updateMessage = async (
  id: string,
  data: Partial<{
    reply: string;
    repliedBy: string;
    status: "Unread" | "Read";
  }>
) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      data
    );
  } catch (error) {
    console.error("❌ Erreur updateMessage:", error);
    throw error;
  }
};

/**
 * 🗑 Supprimer un message
 */
export const deleteMessage = async (id: string) => {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error("❌ Erreur deleteMessage:", error);
    throw error;
  }
};

/**
 * 🔍 Récupérer un seul message (optionnel mais utile)
 */
export const getMessageById = async (id: string) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error("❌ Erreur getMessageById:", error);
    throw error;
  }
};