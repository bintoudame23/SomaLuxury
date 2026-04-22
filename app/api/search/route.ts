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

    // ✅ sécurisation env (IMPORTANT pour Netlify)
    const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
    const collectionId = process.env.NEXT_PUBLIC_TABLE_PRODUIT_ID;

    if (!databaseId || !collectionId) {
      console.error("❌ Missing env variables DATABASE_ID or TABLE_PRODUIT_ID");
      return NextResponse.json([]);
    }

    const res = await databases.listDocuments(databaseId, collectionId, [
      // ⚠️ adapte le champ selon ta base Appwrite
      Query.search("nom_produit", q),

      Query.limit(10),
    ]);

    return NextResponse.json(res.documents);
  } catch (error) {
    console.error("SEARCH API ERROR:", error);
    return NextResponse.json([]);
  }
}