import Link from "next/link";
import { ContentItemEditDialog } from "@/components/ContentItemEditDialog";
import { Paragraphs } from "@/components/Paragraphs";
import Pill from "@/components/Pill";
import { StatusDot } from "@/components/StatusDot";
import TopMenu from "@/components/TopMenu";
import {
	archiveContentItem,
	getContentItem,
	publishContentItem,
} from "@/lib/actions/content";
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
					← Back to content items
				</Link>

				<section className="mt-4 bg-surface border border-border rounded-xl p-5">
					<div className="flex justify-between">
						<StatusDot status={item.status} />
						<Pill>{item.type}</Pill>
					</div>
					<div className="mt-2">
						<h2 className="font-serif text-3xl">{item.title}</h2>
						<p className="text-xs text-muted mt-2">
							By {item.author.fullName}
							{item.deadline && (
								<>
									{" · "}
									<span
										className={isOverdue ? "text-accent" : "text-foreground"}
									>
										Deadline: {formatDeadline(item.deadline)}
									</span>
								</>
							)}
						</p>
					</div>
					<Paragraphs text={item.body} />

					<div className="mt-6 flex flex-wrap gap-3">
						{canPublish ? (
							<form action={publishContentItem.bind(null, item.id)}>
								<button type="submit" className="btn btn-primary">
									Publish
								</button>
							</form>
						) : null}

						<ContentItemEditDialog item={item} allowedNext={allowedNext} />

						<form action={archiveContentItem.bind(null, item.id)}>
							<button type="submit" className="btn">
								Archive
							</button>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
