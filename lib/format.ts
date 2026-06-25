export function formatDeadline(deadline: Date | string | null): string {
	const parsedDeadline =
		typeof deadline === "string" ? new Date(deadline) : deadline;

	if (parsedDeadline === null || Number.isNaN(parsedDeadline.getTime())) {
		return "-";
	}

	const dateFormatted = new Intl.DateTimeFormat("da-DK", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(parsedDeadline);

	return dateFormatted;
}
