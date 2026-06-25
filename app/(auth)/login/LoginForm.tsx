"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Pill from "@/components/Pill";
import TextDivider from "@/components/TextDivider";
import UserLoginButton from "@/components/UserLoginButton";

type QuickLoginUser = {
	id: string;
	username: string;
	role: "EDITOR" | "CONTRIBUTOR";
};

type LoginFormProps = {
	showQuickLogin: boolean;
	quickLoginUsers: QuickLoginUser[];
};

export default function LoginForm({
	showQuickLogin,
	quickLoginUsers,
}: LoginFormProps) {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	async function runLogin(username: string, password: string) {
		setIsPending(true);
		setErrorMessage(null);

		const result = await signIn("credentials", {
			username,
			password,
			redirect: false,
			callbackUrl: "/",
		});

		setIsPending(false);

		if (result?.error) {
			setErrorMessage("Forkert brugernavn eller adgangskode.");
			return;
		}

		router.push(result?.url ?? "/");
		router.refresh();
	}

	async function onManualLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const username = String(formData.get("username") ?? "").trim();
		const password = String(formData.get("password") ?? "");

		if (!username || !password) {
			setErrorMessage("Udfyld både brugernavn og adgangskode.");
			return;
		}

		await runLogin(username, password);
	}

	async function onQuickLogin(username: string) {
		await runLogin(username, "test1234");
	}

	return (
		<main className="min-h-screen grid place-items-center p-6">
			<section className="w-full max-w-105 bg-surface border border-border rounded-xl px-8 py-9">
				<h1 className="mb-6 font-serif text-[26px] tracking-[-.01em]">Login</h1>

				{showQuickLogin ? (
					<>
						<p className="text-muted mt-1.5">
							Vaelg en konto for at logge ind - alle bruger adgangskoden{" "}
							<strong>test1234</strong>.
						</p>
						<div className="space-y-2 mt-6">
							{quickLoginUsers.map((user) => (
								<UserLoginButton
									key={user.id}
									onClick={() => onQuickLogin(user.username)}
									disabled={isPending}
								>
									{user.username}
									<Pill>{user.role}</Pill>
								</UserLoginButton>
							))}
						</div>
						<TextDivider text="eller login manuelt" />
					</>
				) : null}

				<form onSubmit={onManualLoginSubmit}>
					<div>
						<label htmlFor="username">Brugernavn</label>
						<input
							type="text"
							id="username"
							name="username"
							className="input"
							autoComplete="username"
							disabled={isPending}
						/>
					</div>
					<div className="mt-4">
						<label htmlFor="password">Adgangskode</label>
						<input
							type="password"
							id="password"
							name="password"
							className="input"
							autoComplete="current-password"
							disabled={isPending}
						/>
					</div>
					{errorMessage ? (
						<p className="mt-2 text-sm text-accent">{errorMessage}</p>
					) : null}
					<button
						type="submit"
						className="btn btn-primary w-full mt-10"
						disabled={isPending}
					>
						{isPending ? "Logger ind..." : "Login"}
					</button>
				</form>
			</section>
		</main>
	);
}
