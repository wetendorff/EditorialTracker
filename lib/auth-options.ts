import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

type AuthUser = {
	id: string;
	name: string;
	role: "EDITOR" | "CONTRIBUTOR";
};

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const username = credentials?.username?.trim();
				const password = credentials?.password;

				if (!username || !password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { username },
				});

				if (!user || user.password !== password) {
					return null;
				}

				const authUser: AuthUser = {
					id: user.id,
					name: user.fullName,
					role: user.role,
				};

				return authUser;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.userId = user.id;
				token.name = user.name;
				token.role = (user as AuthUser).role;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.name = token.name ?? "";
				(session.user as { id?: string; role?: string }).id = token.userId as string;
				(session.user as { id?: string; role?: string }).role = token.role as string;
			}

			return session;
		},
	},
};
