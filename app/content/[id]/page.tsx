import Link from "next/link";
import {
	archiveContentItem,
	getContentItem,
	publishContentItem,
} from "@/app/actions/content";
import { ContentItemEditDialog } from "@/components/ContentItemEditDialog";
import Pill from "@/components/Pill";
import TopMenu from "@/components/TopMenu";
import { nextStatuses } from "@/lib/content-status";
import { formatDeadline } from "@/lib/format";
import { requireSessionUser } from "@/lib/session";

export default async function ContentDetailPage({
	params,
}: PageProps<"/content/[id]">) {
	const { id } = await params;

	const user = await requireSessionUser();
	const item = await getContentItem(id);

	const allowedNext = nextStatuses(item.status, user.role);
	const isOverdue = item.deadline
		? new Date(item.deadline) < new Date()
		: false;
	const canPublish = user.role === "EDITOR" && item.status === "Review";

	return (
		<div>
			<TopMenu fullName={user.name} role={user.role} />

			<main className="p-6 max-w-4xl mx-auto">
				<Link
					href="/"
					className="inline-block text-sm text-muted hover:text-foreground"
				>
					← Tilbage
				</Link>

				<section className="mt-4 bg-surface border border-border rounded-xl p-5">
					<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
						<div>
							<h1 className="font-serif text-xl">{item.title}</h1>
							<p className="text-sm text-muted">Af {item.author.fullName}</p>
						</div>
						<div className="flex gap-2 items-center">
							<Pill>{item.type}</Pill>
							<Pill>{item.status}</Pill>
						</div>
					</div>

					<div className="mt-4 text-sm">
						<span className="text-muted">Deadline: </span>
						<span className={isOverdue ? "text-accent" : "text-foreground"}>
							{formatDeadline(item.deadline)}
						</span>
					</div>

					<div className="mt-6 flex flex-wrap gap-3">
						{canPublish ? (
							<form action={publishContentItem.bind(null, item.id)}>
								<button type="submit" className="btn btn-primary">
									Publicér
								</button>
							</form>
						) : null}

						<ContentItemEditDialog item={item} allowedNext={allowedNext} />

						<form action={archiveContentItem.bind(null, item.id)}>
							<button type="submit" className="btn">
								Arkivér
							</button>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
