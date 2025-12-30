import { Client, Account, Databases, TablesDB } from "node-appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // your endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // your project ID
    .setKey(process.env.NEXT_PUBLIC_API_KEY!)
    

const account = new Account(client);

const databases = new Databases(client);

const tableDB = new TablesDB(client)
 
export { client, account, databases, tableDB };

client.ping()
    .then(response => console.log("Appwrite is reachable:", response))
    .catch(err => console.error("Failed to ping Appwrite:", err));
function setSession(arg0: string) {
    throw new Error("Function not implemented.");
}

