import LogoutButton from "./LogoutButton";
import Pill from "./Pill";

type TopMenuProps = {
	fullName: string;
	role: string;
};

export default function TopMenu({ fullName, role }: TopMenuProps) {
	return (
		<header className="flex items-center justify-between px-7 py-3.5 border-b border-border">
			<h1 className="font-serif text-xl">
				Editorial<span className="font-serif text-accent">Tracker</span>
			</h1>
			<nav className="flex gap-5 items-center">
				<span className="text-[15px]">
					{fullName} <Pill>{role}</Pill>
				</span>
				<LogoutButton />
			</nav>
		</header>
	);
}
