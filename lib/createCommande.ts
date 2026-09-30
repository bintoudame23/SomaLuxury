import { NextResponse } from "next/server";
import { databases } from "./appwrite";
import { ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COMMANDES_COLLECTION_ID = "commandes";
const token='EAAYEMdgWynEBSpZBc8PB0XplWjXda1udarEqGdFvRyMSv2VZAatRPz2ZC9quGfYP0ZAQgLoGQeaqtFETVVYjADTUrYRZA264Mald92hmEaaZCR74HmAv0FrhYOVJUrUE53IvdwPCwJKIb8qe0AxUMAZCZAyLhZAnlXdvx9FKYTcNdgyITrPpnC7leT2MyU0Fvvz1w8BLE7lly9HkT5pf0docEHe1pDKpKf6nJU1VNLHY2NiQyTmqhcw6lFlD8hjPTGMUZCmyLC4TYtoz9hzp8v9gUuFHM1';
const phoneNumberId ='1361433963715645';

export const createCommande = async (data: any) => {
  const createCMD = await databases.createDocument(
    DATABASE_ID,
    COMMANDES_COLLECTION_ID,
    ID.unique(),
    data
  );

  // verification success comd
  if(!createCMD.$id){
    return NextResponse.json(
        {
          success: false,
          message: "Erreur WhatsApp",
          error: data,
        },
      );
  }

   console.log(DATABASE_ID,process.env.WHATSAPP_ACCESS_TOKEN!,{token, phoneNumberId});
   

  // envoi notif watsapp
  const response = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: data.clientNumero,
          type: "template",
          template: {
            name: "commande_validee",
            language: {
              code: "fr",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: data.clientName,
                  },
                  {
                    type: "text",
                    text: createCMD.$id,
                  },
                  {
                    type: "text",
                    text: `${data.total} FCFA`,
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const whatsappRes = await response.json();

    if (!whatsappRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Erreur WhatsApp",
          error: data,
        },
        { status: whatsappRes.status }
      );
    }

    console.log(whatsappRes);
    

  return NextResponse.json(
        {
          success: true,
          message: "Commande enregistré avec succès",
        },
      );;
};