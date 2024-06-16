import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { connectToDB } from "@/lib/utils"
import { User } from "@/models/User"
import { hash } from "bcryptjs"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await auth()
    if (session?.user) return redirect('/')
    const submitHandler = async (data: FormData) => {
        'use server'
        const name = data.get('name') as string | undefined
        const email = data.get('email') as string | undefined
        const password = data.get('password') as string | undefined
        if (!name || !email || !password) throw new Error('Please provide all the fields')
        await connectToDB()
        const user = await User.findOne({ email })
        if (user) throw new Error('User already exists')
        const hashedP = await hash(password, 7)
        await User.create({
            name,
            email,
            password: hashedP
        })
        redirect('/login')
    }
    return (
        <div className="flex justify-center items-center h-dvh">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Sign Up
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className='flex flex-col gap-4' action={submitHandler}>
                        <Input name='name' placeholder='Name' />
                        <Input name='email' placeholder='Email' type='email' />
                        <Input name='password' placeholder='Password' type='password' />
                        <Button type='submit'>
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <span>
                        Or
                    </span>
                    <form>
                        {/* explore the variants */}
                        <Button type='submit' variant='ghost'>
                            Login with Google
                        </Button>
                    </form>
                    <Link href='/login'>
                        Already have an account? Log In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page