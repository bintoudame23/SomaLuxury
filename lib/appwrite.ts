import { Client, Account, Databases, Storage, Query } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

// ⚠️ NE PAS CRASH LE BUILD
if (!endpoint || !projectId || !apiKey) {
  console.warn("⚠️ Appwrite env missing (server running in degraded mode)");
}

const client = new Client();

// ⚠️ sécurisation (évite crash build)
if (endpoint && projectId && apiKey) {
  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, Query };