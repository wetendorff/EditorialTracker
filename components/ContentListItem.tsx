import Link from "next/link";
import type { ContentItemWithAuthor } from "@/app/actions/content";
import { formatDeadline } from "../lib/format";
import { StatusDot } from "./StatusDot";

export default function ContentListItem({
	item,
}: {
	item: ContentItemWithAuthor;
}) {
	const isOverdue = item.deadline
		? new Date(item.deadline) < new Date()
		: false;

	return (
		<li className="border-t last:border-b border-border px-3 py-2 hover:bg-surface">
			<Link
				href={`/content/${item.id}`}
				className="w-full flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
			>
				<div>
					<span className="font-serif text-lg">{item.title}</span>
					<br />
					<span className="text-muted text-sm">
						{item.type} · By {item.author.fullName}
					</span>
				</div>
				<div className="text-right">
					<StatusDot status={item.status} />
					<br />
					<span
						className={`text-sm ${isOverdue ? "text-accent font-bold" : "text-muted"}`}
					>
						{formatDeadline(item.deadline)}
					</span>
				</div>
			</Link>
		</li>
	);
}
