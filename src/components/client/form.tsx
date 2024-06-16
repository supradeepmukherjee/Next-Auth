'use client'

import { submitHandler } from "@/actions/login"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const LoginForm = () => {
    const router = useRouter()
    return (
        <form className='flex flex-col gap-4' action={async (data: FormData) => {
            const email = data.get('email') as string
            const password = data.get('password') as string
            if (!email || !password) return toast.error('Please fill all the Fields')
            const id = toast.loading('Logging in')
            const err = await submitHandler(email, password)
            if (!err) {
                toast.success('Login Successful', { id })
                router.replace('/')
            }
            else toast.error(String(err), { id })
        }}>
            <Input type='email' name='email' placeholder='Email' />
            <Input type='password' name='password' placeholder='Password' />
            <Button type='submit'>
                Login
            </Button>
        </form>
    )
}

export { LoginForm }
