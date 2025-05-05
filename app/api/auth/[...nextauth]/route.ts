// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// ขยาย type สำหรับ NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    };
    accessToken: string;
  }

  interface JWT {
    accessToken: string;
    refreshToken?: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // 1. ตรวจสอบว่ามี credentials
          if (!credentials?.username || !credentials?.password) {
            console.error("Missing credentials");
            throw new Error("Username and password are required");
          }

          // 2. ส่ง request ไปยัง API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          // 3. ตรวจสอบ response
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("API Error:", {
              status: response.status,
              statusText: response.statusText,
              errorData,
            });
            throw new Error(errorData.message || "Authentication failed");
          }

          // 4. ดึงข้อมูล response
          const data = await response.json();
          console.log("API Response:", data);

          // 5. ตรวจสอบ token
          if (!data.access_token) {
            throw new Error("No access token received");
          }

          // 6. Decode JWT payload
          let payload;
          try {
            const tokenParts = data.access_token.split(".");
            if (tokenParts.length !== 3) {
              throw new Error("Invalid JWT format");
            }
            payload = JSON.parse(
              Buffer.from(tokenParts[1], "base64").toString()
            );
            console.log("JWT Payload:", payload);
          } catch (jwtError) {
            console.error("JWT Decoding Error:", jwtError);
            throw new Error("Invalid token format");
          }

          // 7. Return user object
          return {
            id: payload.sub || data.user?.id || "unknown",
            username: payload.username || credentials.username,
            role: payload.role || data.user?.role || "user",
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          console.error("Authentication Error:", error);
          throw error; // ส่ง error ไปยัง NextAuth
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 วัน
  },

  callbacks: {
    async jwt({ token, user }) {
      // 1. รับข้อมูลจาก user (ครั้งแรกที่ login)
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.sub = user.id;
      }

      // 2. Return token ใหม่
      return token;
    },

    async session({ session, token }) {
      // 1. เพิ่มข้อมูลเข้า session
      if (token.sub) {
        session.user = {
          id: token.sub,
          username: token.username || "",
          role: token.role || "user",
        };
        session.accessToken = token.accessToken;
      }

      // 2. Return session
      return session;
    },

    async redirect({ url, baseUrl }) {
      // กำหนดการ redirect หลัง login
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
