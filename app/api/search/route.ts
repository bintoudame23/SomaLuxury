import { NextResponse } from "next/server";
import { databases } from "@/lib/appwriteServer";
import { Query } from "appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json([]);
    }

    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TABLE_PRODUIT_ID!,
      [
        Query.search("name", q),
        Query.limit(10),
      ]
    );

    return NextResponse.json(res.documents);

  } catch (error) {
    console.error("SEARCH API ERROR:", error);

    return NextResponse.json([]);
  }
}