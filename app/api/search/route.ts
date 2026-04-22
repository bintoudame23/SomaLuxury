import { NextResponse } from "next/server";
import { databases } from "@/lib/appwriteServer";
import { Query } from "appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim() === "") {
      return NextResponse.json([]);
    }
    
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID;

    if (!databaseId || !collectionId) {
      console.error("❌ Missing Appwrite env variables");
      return NextResponse.json([]);
    }

    const res = await databases.listDocuments(databaseId, collectionId, [
      Query.search("nom_produit", q),
      Query.limit(10),
    ]);

    return NextResponse.json(res.documents);
  } catch (error) {
    console.error("SEARCH API ERROR:", error);
    return NextResponse.json([]);
  }
}