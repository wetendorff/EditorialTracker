import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth-options";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<div>
			<main className="p-6">
				<div className="flex items-center justify-between gap-3">
					<h1 className="font-serif text-2xl">Editorial Tracker</h1>
					<LogoutButton />
				</div>
				<p className="mt-3 text-muted">
					Du er logget ind som {session.user?.name ?? "ukendt bruger"}.
				</p>
			</main>
		</div>
	);
}
