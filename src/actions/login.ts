'use server'

import { signIn } from "@/auth"
import { CredentialsSignin } from "next-auth"

export const submitHandler = async (email: string, password: string) => {
    try {
        console.log('logging in')
        await signIn('credentials', {
            email,
            password,
            redirect: true,
            redirectTo: '/'
        })
    } catch (err) {
        const error = err as CredentialsSignin
        return error.cause
    }
}