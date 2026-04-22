import { account } from "@/lib/appwrite"; // adapte selon ton projet Appwrite

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};