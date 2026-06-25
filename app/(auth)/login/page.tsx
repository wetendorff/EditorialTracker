import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/");
	}

	const showQuickLogin = process.env.NODE_ENV !== "production";

	const quickLoginUsers = showQuickLogin
		? await prisma.user.findMany({
				select: {
					id: true,
					username: true,
					role: true,
				},
				orderBy: {
					username: "asc",
				},
			})
		: [];

	return (
		<LoginForm
			showQuickLogin={showQuickLogin}
			quickLoginUsers={quickLoginUsers}
		/>
	);
}
