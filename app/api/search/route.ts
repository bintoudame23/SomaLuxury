import { NextResponse } from "next/server";
import { databases, Query } from "@/lib/appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json([]);
    }

    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TABLE_PRODUIT_ID!,
      [
        Query.search("nom_produit", q),
        Query.limit(10),
      ]
    );

    return NextResponse.json(res.documents);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    return NextResponse.json([]);
  }
}