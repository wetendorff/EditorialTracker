export function Paragraphs({ text }: { text: string | null }) {
	if (!text) return null;

	const normalized = text.replace(/\r\n/g, "\n");

	return (
		<div className="mt-4 text-base text-foreground/80 max-w-prose">
			{normalized.split(/\n{2,}/).map((paragraph, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: paragraph array is static, never reordered
				<p key={i} className={i > 0 ? "mt-2" : undefined}>
					{paragraph.trim()}
				</p>
			))}
		</div>
	);
}
