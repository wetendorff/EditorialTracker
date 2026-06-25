"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ContentStatus, ContentType } from "@/app/generated/prisma/client";
import type { ContentItemGetPayload } from "@/app/generated/prisma/models/ContentItem";
import { authOptions } from "@/lib/auth-options";
import { isAllowedTransition } from "@/lib/content-status";
import { prisma } from "@/lib/prisma";

export type ContentItemWithAuthor = ContentItemGetPayload<{
	include: { author: { select: { fullName: true } } };
}>;

type SessionUser = { id: string; role: string };

async function requireSessionUser(): Promise<SessionUser> {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/login");
	}
	return session.user as SessionUser;
}

export async function getContentItems(): Promise<ContentItemWithAuthor[]> {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return [];
	}

	const user = session.user as SessionUser;

	return prisma.contentItem.findMany({
		where:
			user.role === "EDITOR"
				? { archived: false }
				: { authorId: user.id, archived: false },
		include: {
			author: {
				select: { fullName: true },
			},
		},
		orderBy: [{ status: "asc" }, { deadline: "asc" }, { title: "asc" }],
	});
}

export async function getContentItem(
	id: string,
): Promise<ContentItemWithAuthor> {
	const user = await requireSessionUser();

	const item = await prisma.contentItem.findUnique({
		where: { id },
		include: { author: { select: { fullName: true } } },
	});

	if (!item) {
		notFound();
	}
	if (user.role !== "EDITOR" && item.authorId !== user.id) {
		notFound();
	}
	return item;
}

export async function createContentItem(formData: FormData) {
	const user = await requireSessionUser();

	const title = formData.get("title") as string;
	const status = formData.get("status") as ContentStatus;
	const type = formData.get("type") as ContentType;
	const deadlineRaw = formData.get("deadline") as string | null;
	const deadline = deadlineRaw ? new Date(deadlineRaw) : null;

	await prisma.contentItem.create({
		data: {
			title,
			status,
			type,
			deadline,
			authorId: user.id,
		},
	});

	revalidatePath("/");
}

export async function updateContentItem(id: string, formData: FormData) {
	const user = await requireSessionUser();

	const existing = await prisma.contentItem.findUnique({ where: { id } });
	if (!existing) {
		notFound();
	}
	if (user.role !== "EDITOR" && existing.authorId !== user.id) {
		notFound();
	}

	const title = formData.get("title") as string;
	const status = formData.get("status") as ContentStatus;
	const type = formData.get("type") as ContentType;
	const deadlineRaw = formData.get("deadline") as string | null;
	const deadline = deadlineRaw ? new Date(deadlineRaw) : null;

	if (status !== existing.status) {
		if (!isAllowedTransition(existing.status, status, user.role)) {
			throw new Error(
				`Status transition ${existing.status} -> ${status} is not allowed.`,
			);
		}
	}

	await prisma.contentItem.update({
		where: { id },
		data: { title, status, type, deadline },
	});

	revalidatePath(`/content/${id}`);
	revalidatePath("/");
}

export async function publishContentItem(id: string) {
	const user = await requireSessionUser();
	if (user.role !== "EDITOR") {
		throw new Error("Only editors can publish content items.");
	}

	const item = await prisma.contentItem.findUnique({ where: { id } });
	if (!item) {
		notFound();
	}
	if (item.status !== "Review") {
		throw new Error("Item must be in Review before it can be published.");
	}

	await prisma.contentItem.update({
		where: { id },
		data: { status: "Published" },
	});

	revalidatePath(`/content/${id}`);
	revalidatePath("/");
}

export async function archiveContentItem(id: string) {
	const user = await requireSessionUser();

	const item = await prisma.contentItem.findUnique({ where: { id } });
	if (!item) {
		notFound();
	}
	if (user.role !== "EDITOR" && item.authorId !== user.id) {
		notFound();
	}

	await prisma.contentItem.update({
		where: { id },
		data: { archived: true },
	});

	revalidatePath("/");
	redirect("/");
}
