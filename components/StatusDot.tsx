import type { ContentStatus } from "@/app/generated/prisma/client";

const STATUS_COLOR: Record<ContentStatus, string> = {
	Idea: "bg-slate-400",
	Draft: "bg-blue-500",
	Review: "bg-amber-500",
	Published: "bg-green-500",
};

export function StatusDot({ status }: { status: ContentStatus }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-sm">
			<span className={`h-2 w-2 rounded-full ${STATUS_COLOR[status]}`} />
			{status}
		</span>
	);
}
