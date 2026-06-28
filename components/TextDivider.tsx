type TextDividerProps = {
	text: string;
};

export default function TextDivider({ text }: TextDividerProps) {
	return (
		<div className="my-8 flex justify-between items-center gap-4">
			<div className="bg-border h-px grow"></div>
			<div className="shrink text-xs text-muted">{text}</div>
			<div className="bg-border h-px grow"></div>
		</div>
	);
}
