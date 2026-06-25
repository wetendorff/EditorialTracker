import Pill from "@/components/Pill";
import TextDivider from "@/components/TextDivider";
import UserLoginButton from "@/components/UserLoginButton";

export default function LoginPage() {
	return (
		<main className="min-h-screen grid place-items-center p-6">
			<section className="w-full max-w-105 bg-surface border border-border rounded-xl px-8 py-9">
				<h1 className="mb-6 font-serif text-[26px] tracking-[-.01em]">Login</h1>
				<p className="text-muted mt-1.5">
					Vælg en konto for at logge ind — alle bruger adgangskoden{" "}
					<strong>test1234</strong>.
				</p>
				<div className="space-y-2 mt-6">
					<UserLoginButton>
						Erik<Pill>EDITOR</Pill>
					</UserLoginButton>
					<UserLoginButton>
						Carl<Pill>CONTRIBUTOR</Pill>
					</UserLoginButton>
				</div>
				<TextDivider text="eller login manuelt" />
				<form>
					<div>
						<label htmlFor="username">Brugernavn</label>
						<input
							type="text"
							id="username"
							name="username"
							className="input"
						/>
					</div>
					<div className="mt-4">
						<label htmlFor="password">Adgangskode</label>
						<input
							type="password"
							id="password"
							name="password"
							className="input"
						/>
					</div>
					<button type="submit" className="btn btn-primary w-full mt-10">
						Login
					</button>
				</form>
			</section>
		</main>
	);
}
