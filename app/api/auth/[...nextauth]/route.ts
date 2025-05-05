import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    };
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
          }
        );
        const data = await res.json();
        if (!res.ok) return null;
        const payload = JSON.parse(
          Buffer.from(data.access_token.split(".")[1], "base64").toString()
        );
        console.log(payload);
        return {
          id: payload.sub,
          username: payload.username,
          role: payload.role,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user)
        Object.assign(token, {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
        });
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub as string,
        username: token.username as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
