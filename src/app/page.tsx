import { auth } from "@/auth";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await auth()
  console.log(session)
  // const cookies_ = cookies().getAll()
  const sessionToken = cookies().get('authjs.session-token')
  console.log(await decode({
    token: sessionToken?.value,
    secret: process.env.AUTH_SECRET!,
    salt: sessionToken?.name!
  }))
  return <div className="h-screen bg-black"></div>
}
