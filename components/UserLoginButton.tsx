export default function UserLoginButton({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			className="w-full flex font-sans items-center gap-3 p-3 text-left bg-transparent justify-between border border-border rounded-lg cursor-pointer text-[15px] transition-colors duration-200 hover:border-accent"
		>
			{children}
		</button>
	);
}
