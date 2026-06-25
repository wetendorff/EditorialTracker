"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
	return (
		<button
			type="button"
			className="btn"
			onClick={() => signOut({ callbackUrl: "/login" })}
		>
			Logout
		</button>
	);
}
