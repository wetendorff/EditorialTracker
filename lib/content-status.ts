import type { ContentStatus } from "@/app/generated/prisma/client";

export function nextStatuses(
	current: ContentStatus,
	role: string,
): ContentStatus[] {
	if (current === "Idea") return ["Draft"];
	if (current === "Draft") return ["Review"];
	if (current === "Review" && role === "EDITOR") return ["Published"];
	return [];
}

export function isAllowedTransition(
	from: ContentStatus,
	to: ContentStatus,
	role: string,
): boolean {
	return nextStatuses(from, role).includes(to);
}
