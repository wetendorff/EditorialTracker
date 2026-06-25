import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ContentItemCreateDialog } from "@/components/ContentItemCreateDialog";
import TopMenu from "@/components/TopMenu";
import { authOptions } from "@/lib/auth-options";
import ContentItemList from "../components/ContentItemList";
import { getContentItems } from "./actions/content";

export default async function Home() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	const contentItems = await getContentItems();

	const user = session.user as { name?: string; role?: string };

	return (
		<div>
			<TopMenu fullName={user.name ?? ""} role={user.role ?? ""} />
			<main className="p-6 max-w-4xl mx-auto">
				<section className="mt-8">
					<div className="flex items-center justify-between">
						<h2 className="font-serif text-xl">Content items</h2>
						<ContentItemCreateDialog />
					</div>
					<ContentItemList items={contentItems} />
				</section>
			</main>
		</div>
	);
}
