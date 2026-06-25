export function formatDeadline(deadline: Date | string | null): string {
	if (!deadline) {
		return "Ingen deadline";
	}

	const parsedDeadline =
		typeof deadline === "string" ? new Date(deadline) : deadline;

	if (Number.isNaN(parsedDeadline.getTime())) {
		return "Ingen deadline";
	}

	const dateFormatted = new Intl.DateTimeFormat("da-DK", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(parsedDeadline);

	return dateFormatted;
}
