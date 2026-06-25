"use client";

import { useState } from "react";
import type { ContentItemWithAuthor } from "@/app/actions/content";
import type { ContentStatus } from "@/app/generated/prisma/client";
import ContentListItem from "./ContentListItem";

type FilterStatus = "All" | ContentStatus;

const FILTER_STATUSES: FilterStatus[] = [
	"All",
	"Idea",
	"Draft",
	"Review",
	"Published",
];

export default function ContentItemList({
	items,
}: {
	items: ContentItemWithAuthor[];
}) {
	const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

	const filteredItems =
		activeFilter === "All"
			? items
			: items.filter((item) => item.status === activeFilter);

	return (
		<div className="mt-6">
			<div className="flex flex-wrap gap-2">
				{FILTER_STATUSES.map((status) => {
					const isActive = activeFilter === status;

					return (
						<button
							key={status}
							type="button"
							onClick={() => setActiveFilter(status)}
							className={`chip ${isActive ? "chip-active" : ""}`}
						>
							{status}
						</button>
					);
				})}
			</div>

			<div className="mt-4">
				{filteredItems.length === 0 ? (
					<p className="mt-4 text-sm text-muted">No items here yet.</p>
				) : (
					<ul className="mt-4">
						{filteredItems.map((item) => (
							<ContentListItem item={item} key={item.id} />
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
