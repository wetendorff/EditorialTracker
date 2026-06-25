import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export type SessionUser = { id: string; name: string; role: string };

export async function requireSessionUser(): Promise<SessionUser> {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/login");
	}
	return session.user as SessionUser;
}
