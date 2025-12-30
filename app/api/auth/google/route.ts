import { NextResponse } from "next/server";

// 🔹 Simulation d'une base de données temporaire (mémoire)
let commandes: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 🔸 Ajout d’un identifiant et de la date
    const nouvelleCommande = {
      id: Date.now().toString(),
      ...data,
      dateCommande: new Date().toLocaleString(),
      statut: "à traiter",
    };

    commandes.push(nouvelleCommande);
    console.log("🛒 Nouvelle commande reçue :", nouvelleCommande);

    return NextResponse.json({
      success: true,
      message: "Commande enregistrée avec succès",
      commande: nouvelleCommande,
    });
  } catch (error) {
    console.error("❌ Erreur API commande :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// 🔹 Récupérer toutes les commandes (pour ton admin)
export async function GET() {
  try {
    return NextResponse.json(commandes);
  } catch (error) {
    console.error("❌ Erreur récupération :", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
