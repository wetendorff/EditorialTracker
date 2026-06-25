"use client";

import { useRef, useTransition } from "react";
import type { ContentItemWithAuthor } from "@/app/actions/content";
import { updateContentItem } from "@/app/actions/content";
import type { ContentStatus, ContentType } from "@/app/generated/prisma/client";
import { ContentType as ContentTypeEnum } from "@/app/generated/prisma/enums";

const TYPE_OPTIONS: ContentType[] = [
	ContentTypeEnum.Article,
	ContentTypeEnum.Video,
	ContentTypeEnum.Podcast,
	ContentTypeEnum.Other,
];

export function ContentItemEditDialog({
	item,
	allowedNext,
}: {
	item: ContentItemWithAuthor;
	allowedNext: ContentStatus[];
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const [, startTransition] = useTransition();

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(async () => {
			await updateContentItem(item.id, formData);
			ref.current?.close();
		});
	}

	return (
		<>
			<button
				type="button"
				className="btn"
				onClick={() => ref.current?.showModal()}
			>
				Rediger
			</button>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop-click-to-close is a mouse enhancement; native Esc closes for keyboard users */}
			<dialog
				ref={ref}
				className="bg-surface border border-border rounded-xl p-6 max-w-lg w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				onClick={(e) => {
					if (e.target === ref.current) {
						ref.current?.close();
					}
				}}
			>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<h2 className="font-serif text-lg">Rediger content item</h2>
					<div>
						<label htmlFor="title">Titel</label>
						<input
							id="title"
							name="title"
							defaultValue={item.title}
							className="input"
							required
						/>
					</div>
					<div>
						<label htmlFor="type">Type</label>
						<select id="type" name="type" defaultValue={item.type}>
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
							defaultValue={
								item.deadline
									? new Date(item.deadline).toISOString().slice(0, 10)
									: ""
							}
						/>
					</div>
					{allowedNext.length > 0 ? (
						<div>
							<label htmlFor="status">Status</label>
							<select id="status" name="status" defaultValue={item.status}>
								<option value={item.status}>{item.status}</option>
								{allowedNext.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					) : null}
					<div className="flex justify-between mt-2">
						<button
							type="button"
							className="btn"
							onClick={() => ref.current?.close()}
						>
							Annuller
						</button>
						<button type="submit" className="btn btn-primary">
							Gem
						</button>
					</div>
				</form>
			</dialog>
		</>
	);
}
