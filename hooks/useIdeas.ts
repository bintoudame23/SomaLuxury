// // hooks/useIdeas.ts

// import { useState, useEffect } from "react";
// import { ID, Query, Permission, type Models } from "appwrite";
// import { tablesDB } from "../lib/appwrite";

// const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
// const tableId = process.env.NEXT_PUBLIC_TABLE_ID!;
// const queryLimit = 10;

// interface Idea extends Models.Row {
//   title: string;
//   description: string;
//   userId: string;
// }



// export function useIdeas() {
//   const [current, setCurrent] = useState<Idea[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch the 10 most recent ideas from the database
//   const fetchIdeas = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       const response = await tablesDB.listRows(
//         databaseId,
//         tableId,
//         [Query.orderDesc("$createdAt"), Query.limit(queryLimit)]
//       );

//       console.log(response.rows);
      

//       // Map chaque DefaultRow -> Idea (sécurisé)
//       const ideas: Idea[] = response.rows.map((row: any) => {
//         return {
//           ...row,
//           title: row.title ?? row["title"] ?? "",
//           description: row.description ?? row["description"] ?? "",
//           userId: row.userId ?? row["userId"] ?? row["user_id"] ?? "",
//         } as Idea;
//       });

//       setCurrent(ideas);
//     } catch (error) {
//       console.error("Error fetching ideas:", error);
//       setCurrent([]); // garder état cohérent en cas d'erreur
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new idea to the database
//   const add = async (
//     idea: Omit<Idea, "$id" | "$createdAt" | "$updatedAt" | "$permissions">
//   ): Promise<void> => {
//     try {
//       const response = await tablesDB.createRow(
//         databaseId,
//         tableId,
//         ID.unique(),
//         idea,
//         [
//           Permission.read("any"),
//           Permission.update(`user:${idea.userId}`),
//           Permission.delete(`user:${idea.userId}`),
//         ]
//       );

//       // Normaliser la réponse en Idea
//       const newIdea: Idea = {
//         ...response,
//         title: (response as any).title ?? idea.title,
//         description: (response as any).description ?? idea.description,
//         userId: (response as any).userId ?? idea.userId,
//       } as Idea;

//       setCurrent((prev) => [newIdea, ...prev].slice(0, queryLimit));
//     } catch (error) {
//       console.error("Error adding idea:", error);
//     }
//   };

//   const remove = async (id: string): Promise<void> => {
//     try {
//       await tablesDB.deleteRow(databaseId, tableId, id);
//       // Refetch pour garder l'ordre et la limite
//       await fetchIdeas();
//     } catch (error) {
//       console.error("Error removing idea:", error);
//     }
//   };

//   useEffect(() => {
//     fetchIdeas();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return {
//     current,
//     loading,
//     add,
//     fetch: fetchIdeas,
//     remove,
//   };
// }
