export default function Pill({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-mono text-[10px] uppercase text-muted border border-border rounded-sm px-1.5 py-px">
			{children}
		</div>
	);
}
