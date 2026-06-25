import type { ContentStatus, ContentType } from "@/app/generated/prisma/client";
import {
	ContentStatus as ContentStatusEnum,
	ContentType as ContentTypeEnum,
} from "@/app/generated/prisma/enums";

export const TYPE_OPTIONS: ContentType[] = [
	ContentTypeEnum.Article,
	ContentTypeEnum.Video,
	ContentTypeEnum.Podcast,
	ContentTypeEnum.Other,
];

export const STATUS_OPTIONS: ContentStatus[] = [
	ContentStatusEnum.Idea,
	ContentStatusEnum.Draft,
	ContentStatusEnum.Review,
	ContentStatusEnum.Published,
];

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
