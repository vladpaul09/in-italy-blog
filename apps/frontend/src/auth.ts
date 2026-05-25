import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import config from "@/config";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        locale: { label: "Locale", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password || !credentials?.locale) {
          return null;
        }

        try {
          const apiUrl = `${config.serverNameBackend}/api/website/${credentials.locale}/me/login`;

          // Extract IP from request headers
          const forwarded = req?.headers?.["x-forwarded-for"];
          const userIp = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0]) : req?.headers?.["x-real-ip"] || null;
          const userAgent = req?.headers?.["user-agent"] || "";

          const res = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              ...(userIp && { userIp, userAgent }),
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": credentials.locale,
            },
          });
          
          const data = await res.json();

          if (!res.ok) {
            console.log(data);
            // If validation errors exist, include them in the error
            if (data.errors && typeof data.errors === 'object') {
              const errorMessage = JSON.stringify({
                message: data.message || "Invalid credentials",
                errors: data.errors,
              });
              throw new Error(errorMessage);
            }
            throw new Error(data.message || "Invalid credentials");
          }

          return {
            id: String(data.member.id),
            name: data.member.firstName + " " + data.member.lastName,
            email: data.member.email,
            locale: credentials.locale,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.locale = user.locale;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id || token.sub || "",
          locale: token.locale as string,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: "2s7qRDzVNQScEddpz5FK3/8ZxXx/t+iHeZysZH4ZZRs=",
};

export default authOptions;