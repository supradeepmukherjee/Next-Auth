import { type ClassValue, clsx } from "clsx"
import { connect, connections } from "mongoose"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectToDB = async () => {
  try {
    if (connections && connections[0].readyState) return
    const { connection } = await connect(process.env.MONGO_URI as string)
    console.log('Connected to DB' + connection.host)
  } catch (err) {
    console.log(err)
    throw new Error('Error connecting to DB')
  }
}