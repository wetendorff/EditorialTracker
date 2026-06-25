import LogoutButton from "./LogoutButton";

export default function TopMenu() {
	return (
		<header className="flex items-center justify-between px-7 py-3.5 border-b border-border">
			<h1 className="font-serif text-xl">
				Editorial<span className="font-serif text-accent">Tracker</span>
			</h1>
			<nav>
				<LogoutButton />
			</nav>
		</header>
	);
}
