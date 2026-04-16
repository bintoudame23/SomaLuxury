import { storage } from "@/lib/appwrite";

const bucketId = process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID!;

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
];

export const uploadMedia = async (files: File[]): Promise<string[]> => {
  const uploadedIds: string[] = [];

  for (const file of files) {
    if (!file) continue;

    // Vérification par type MIME (plus fiable que l'extension)
    if (!allowedMimeTypes.includes(file.type)) {
      console.error(`Type non autorisé : ${file.type}`);
      continue;
    }

    try {
      const res = await storage.createFile(
        bucketId,
        "unique()",
        file
      );

      uploadedIds.push(res.$id);
    } catch (err) {
      console.error(`Erreur upload fichier ${file.name} :`, err);
    }
  }

  return uploadedIds;
};