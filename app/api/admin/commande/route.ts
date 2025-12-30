import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Lecture du JSON envoyé par le frontend
    const body = await req.json();

    console.log("📥 Commande reçue :", body);

    // Vérification minimum
    if (!body?.client || !body?.produits || body.produits.length === 0) {
      return NextResponse.json(
        { error: "Données de commande invalides." },
        { status: 400 }
      );
    }

    // En temps normal : insertion dans base de données ici
    // Exemple :
    // await prisma.commande.create({ data: ... })

    // Réponse envoyée au frontend
    
    return NextResponse.json(
      {
        message: "Commande bien reçue et enregistrée",
        statut: "success",
        data: body,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur API /commande :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur, impossible d'enregistrer la commande",
      },
      { status: 500 }
    );
  }
}
