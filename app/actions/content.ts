"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ContentStatus, ContentType } from "@/app/generated/prisma/enums";
import type { ContentItemGetPayload } from "@/app/generated/prisma/models/ContentItem";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export type ContentItemWithAuthor = ContentItemGetPayload<{
	include: { author: { select: { fullName: true } } };
}>;

export async function getContentItems(): Promise<ContentItemWithAuthor[]> {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return [];
	}

	const user = session.user as { id: string; role: string };
	console.log("User:", user);

	return prisma.contentItem.findMany({
		where: user.role === "EDITOR" ? undefined : { authorId: user.id },
		include: {
			author: {
				select: { fullName: true },
			},
		},
		orderBy: [{ status: "asc" }, { deadline: "asc" }, { title: "asc" }],
	});
}

export async function createContentItem(formData: FormData) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/login");
	}

	const user = session.user as { id: string };

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
