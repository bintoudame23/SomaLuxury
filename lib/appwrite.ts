import { Client, Databases, Storage, Query } from "node-appwrite";

const client = new Client();

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

// ⚠️ sécurité build Netlify
if (endpoint && projectId && apiKey) {
  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
}

export const databases = new Databases(client);
export const storage = new Storage(client);
export { Query };