import NextAuth, { NextAuthOptions } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          if (credentials.loginType === "admin") {
            const admins = await prisma.$queryRaw`SELECT id, email, password, name FROM AdminUser WHERE LOWER(email) = LOWER(${credentials.email}) LIMIT 1` as any[];
            
            if (admins.length === 0) {
              throw new Error("Administrator account not found.");
            }

            const admin = admins[0];
            const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
            
            if (!isPasswordValid) {
              throw new Error("The password you entered is incorrect.");
            }
            
            return {
              id: admin.id.toString(),
              email: admin.email,
              name: admin.name,
              role: "admin"
            };
          }

          // Default to Customer login
          const users = await prisma.$queryRaw`SELECT id, email, password, name, isVerified FROM User WHERE LOWER(email) = LOWER(${credentials.email}) LIMIT 1` as any[];

          if (users.length > 0) {
            const customer = users[0];
            
            if (!customer.isVerified) {
              throw new Error("Please verify your email before logging in.");
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, customer.password);

            if (!isPasswordValid) {
              throw new Error("Invalid email or password.");
            }
            
            return {
              id: customer.id.toString(),
              email: customer.email,
              name: customer.name,
              role: "customer"
            };
          }

          throw new Error("Customer account not found.");
        } catch (error: any) {
          console.error("Auth error detail:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
