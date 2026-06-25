import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ContentStatus, ContentType } from "@/app/generated/prisma/client";
import {
	ContentStatus as ContentStatusEnum,
	ContentType as ContentTypeEnum,
} from "@/app/generated/prisma/enums";
import TopMenu from "@/components/TopMenu";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import ContentItemList from "../components/ContentItemList";
import { createContentItem, getContentItems } from "./actions/content";

const STATUS_ORDER: ContentStatus[] = [
	ContentStatusEnum.Idea,
	ContentStatusEnum.Draft,
	ContentStatusEnum.Review,
	ContentStatusEnum.Published,
];
const TYPE_OPTIONS: ContentType[] = [
	ContentTypeEnum.Article,
	ContentTypeEnum.Video,
	ContentTypeEnum.Podcast,
	ContentTypeEnum.Other,
];

export default async function Home() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	const userId = (session.user as { id?: string } | undefined)?.id;
	if (!userId) {
		redirect("/login");
	}

	const dbUser = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			fullName: true,
			role: true,
		},
	});
	if (!dbUser) {
		redirect("/login");
	}

	const contentItems = await getContentItems();

	return (
		<div>
			<TopMenu fullName={dbUser.fullName} role={dbUser.role} />
			<main className="p-6 max-w-4xl mx-auto">
				<section className="mt-8 bg-surface border border-border rounded-xl p-5">
					<h2 className="font-serif text-xl">Nyt content item</h2>
					<form
						action={createContentItem}
						className="mt-4 grid gap-4 md:grid-cols-2"
					>
						<div className="md:col-span-2">
							<label htmlFor="title">Titel</label>
							<input id="title" name="title" className="input" required />
						</div>
						<div>
							<label htmlFor="status">Status</label>
							<select id="status" name="status" defaultValue="Idea">
								{STATUS_ORDER.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
						<div>
							<label htmlFor="type">Type</label>
							<select id="type" name="type" defaultValue="Article">
								{TYPE_OPTIONS.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</div>
						<div>
							<label htmlFor="deadline">Deadline</label>
							<input
								id="deadline"
								name="deadline"
								type="date"
								className="input"
							/>
						</div>
						<div className="flex items-end justify-end md:col-span-2">
							<button type="submit" className="btn btn-primary">
								Opret item
							</button>
						</div>
					</form>
				</section>

				<section className="mt-8">
					<h2 className="font-serif text-xl">Content items</h2>
					<ContentItemList items={contentItems} />
				</section>
			</main>
		</div>
	);
}
