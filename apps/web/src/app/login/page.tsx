import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";
import { AuthCard } from "../_components/auth-card";

export default async function AuthPage() {
	const session = await getSession();
	if (session) redirect("/");

	return (
		// <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
		<main className="relative flex min-h-screen items-center justify-center bg-background px-6">
			{/* Soft gradient background */}
			<div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-muted/30 to-background" />

			{/* Subtle glow blobs */}
			<div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-muted blur-3xl opacity-50" />

			{/* Centered content */}
			<div className="relative w-full max-w-md space-y-6">
				{/* Optional Heading */}
				<div className="text-center space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome to Feather
					</h1>
					<p className="text-sm text-muted-foreground">Sign in to continue</p>
				</div>

				<AuthCard />
			</div>
		</main>
	);
}
