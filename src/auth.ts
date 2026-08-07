import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { mockUser } from "@/data/mock-user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";

        const password =
          typeof credentials.password === "string"
            ? credentials.password
            : "";

        const isValidUser =
          email === mockUser.email &&
          password === mockUser.password;

        if (!isValidUser) {
          return null;
        }

        return {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        };
      },
    }),
  ],
});