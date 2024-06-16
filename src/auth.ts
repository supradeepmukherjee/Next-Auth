import NextAuth, { AuthError, CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { User } from './models/User'
import { compare } from 'bcryptjs'
import { connectToDB } from './lib/utils'

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Credentials({
            // name: 'Desi',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                },
            },
            authorize: async (credentials, request) => {
                const email = credentials.email as string | undefined
                const password = credentials.password as string | undefined
                if (!email || !password) throw new CredentialsSignin({ cause: 'Please provide the required Credentials' })
                await connectToDB()
                const user = await User.findOne({ email }).select('+password')
                if (!user) throw new CredentialsSignin({ cause: 'Invalid Email/Password' })
                if (!user.password) throw new CredentialsSignin({ cause: 'Invalid Email/Password' })
                const isMatch = await compare(password, user.password)
                if (!isMatch) throw new CredentialsSignin({ cause: 'Invalid Email/Password' })
                // if (!user.isVerified) throw new CredentialsSignin('Please Verify Yourself before Logging In')
                return {
                    name: user.name,
                    email: user.email,
                    id: user._id
                }
            },
        })
    ],
    pages: { signIn: '/login' },
    callbacks: {
        signIn: async ({ user, account, profile, email }) => {
            if (account?.provider === 'google') {
                try {
                    const { email, id, name } = user
                    await connectToDB()
                    const userExists = await User.findOne({ email })
                    if (!userExists) await User.create({
                        email,
                        name,
                        gID: id
                    })
                    return true
                } catch (err) {
                    console.log(err)
                    throw new AuthError('Failed to create User')
                }
            }
            if (account?.provider === 'credentials') return true
            return false
        },
    }
})