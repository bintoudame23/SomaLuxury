import { Client, Account, Databases, Storage, Query } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error("⚠️ Les variables d'environnement Appwrite ne sont pas définies !");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, Query };

client
  .ping()
  .then((response) => console.log("✅ Appwrite reachable:", response))
  .catch((err) => console.error("❌ Failed to ping Appwrite:", err));