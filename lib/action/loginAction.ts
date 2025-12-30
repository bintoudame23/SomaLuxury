"use server"
import {email, z} from "zod"
import { redirect } from "next/navigation"
import { account } from "../appwrite"

const loginSchema = z.object({
    email: z.email({message: "Veuillez entrer un mail valide"}),
    password: z.string().min(1, {message: "Veuillez saisir le mot de passe!"})
})

export const login = async (state: any, formdata: FormData) => {

    try {
        const isValid = loginSchema.safeParse({
        email: formdata.get('email'),
        password: formdata.get('password')
    })

    if (!isValid.success) {
        return {
            errors: isValid.error.flatten().fieldErrors
        }
    }

    const { email, password } = isValid.data
    
    const result = await account.createEmailPasswordSession({
        email,
        password
    });
    console.log(result);
    
    } catch (error) {
        return {
            error: "Login/mot de passe incorrect!"
        }
        
    }
    
    redirect('/admin/dashboard')
}