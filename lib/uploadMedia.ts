import { storage } from "@/lib/appwrite";

const bucketId = process.env.NEXT_PUBLIC_BUCKET_MEDIA_ID!;

export const uploadMedia = async (files: File[]) => {
  const uploadedIds: string[] = [];

  for (const file of files) {
    if (!file) continue;

    const res = await storage.createFile(
      bucketId,
      "unique()",
      file
    );

    uploadedIds.push(res.$id);
  }

  return uploadedIds;
};
