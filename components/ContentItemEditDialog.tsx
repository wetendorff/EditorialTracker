"use client";

import { useRef, useTransition } from "react";
import type { ContentStatus } from "@/app/generated/prisma/client";
import type { ContentItemWithAuthor } from "@/lib/actions/content";
import { updateContentItem } from "@/lib/actions/content";
import { TYPE_OPTIONS } from "@/lib/content-status";

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
					<h2 className="text-3xl">Edit content item</h2>
					<div>
						<label htmlFor="title">Title</label>
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
					<div>
						<label htmlFor="body">Body</label>
						<textarea
							id="body"
							name="body"
							className="input"
							rows={6}
							defaultValue={item.body ?? ""}
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
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							Save
						</button>
					</div>
				</form>
			</dialog>
		</>
	);
}
