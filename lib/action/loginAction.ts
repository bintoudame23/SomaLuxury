"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { account } from "../appwrite";

// ✅ ZOD CORRECT
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer un mail valide"),
  password: z.string().min(1, "Veuillez saisir le mot de passe !"),
});

export const login = async (state: any, formdata: FormData) => {
  try {
    const isValid = loginSchema.safeParse({
      email: formdata.get("email"),
      password: formdata.get("password"),
    });

    if (!isValid.success) {
      return {
        errors: isValid.error.flatten().fieldErrors,
      };
    }

    const { email, password } = isValid.data;

    // ✅ APPWRITE CORRECT
    const result = await account.createEmailPasswordSession(
      email,
      password
    );

    console.log("LOGIN OK:", result);
  } catch (error) {
    console.error(error);

    return {
      error: "Login/mot de passe incorrect!",
    };
  }

  redirect("/admin/dashboard");
};