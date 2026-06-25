"use client";

import { useRef, useTransition } from "react";
import { createContentItem } from "@/app/actions/content";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "@/lib/content-status";

export function ContentItemCreateDialog() {
	const ref = useRef<HTMLDialogElement>(null);
	const [, startTransition] = useTransition();

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(async () => {
			await createContentItem(formData);
			ref.current?.close();
		});
	}

	return (
		<>
			<button
				type="button"
				className="btn btn-primary"
				onClick={() => ref.current?.showModal()}
			>
				Create
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
					<h2 className="font-serif text-2xl">New content item</h2>
					<div>
						<label htmlFor="title">Title</label>
						<input id="title" name="title" className="input" required />
					</div>
					<div>
						<label htmlFor="type">Type</label>
						<select id="type" name="type" defaultValue="Article">
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
						/>
					</div>
					<div>
						<label htmlFor="status">Status</label>
						<select id="status" name="status" defaultValue="Idea">
							{STATUS_OPTIONS.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-between mt-2">
						<button
							type="button"
							className="btn"
							onClick={() => ref.current?.close()}
						>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							Create
						</button>
					</div>
				</form>
			</dialog>
		</>
	);
}
