import { NextAuthOptions } from "next-auth";
<<<<<<< HEAD

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db)
=======
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

function getGGCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0) {
    throw new Error('Google ClientID not set')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Google client secret not set')
  }

  return {clientId, clientSecret}
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    GoogleProvider({
      clientId: getGGCredentials().clientId,
      clientSecret: getGGCredentials().clientSecret
    })
  ],
  callbacks: {
    async session({token, session}) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
    async jwt({token, user}) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        }
      })

      if (!dbUser) {
        token.id = user!.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.image,
        picture: dbUser.image,
      }
    },
    redirect() {
      return '/dashboard'
    } 
  }
>>>>>>> 2f638e7581fed31393218a1279a3b199eea24663
}