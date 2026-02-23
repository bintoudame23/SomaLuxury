import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

export const fetchSubCategoriesByCategory = async (categorieNom: string) => {
  if (!process.env.NEXT_PUBLIC_DATABASE_ID || !process.env.NEXT_PUBLIC_TABLE_SUBCATEGORIES_ID) {
    console.error("Variables d'environnement manquantes pour SubCategory");
    return [];
  }

  try {
    const result = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TABLE_SUBCATEGORIES_ID!,
      [
        Query.equal("categorie", categorieNom) 
      ]
    );
    return result.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des sous-catégories :", error);
    return [];
  }
};
