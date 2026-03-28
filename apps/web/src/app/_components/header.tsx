import Link from "next/link";
import { getSession } from "~/auth/server";
import { UserMenu } from "./user-menu";

export async function Header() {
	const session = await getSession();

	return (
		<header className="sticky top-0 z-50 border-b border-white/6 bg-black/80 backdrop-blur-md">
			<div className="container flex h-14 items-center justify-between">
				<Link
					href="/"
					className="text-2xl font-light text-white transition-opacity hover:opacity-70"
				>
					Feather
				</Link>

				<nav className="flex items-center gap-1">
					{session ? (
						<UserMenu
							id={session.user.id}
							name={session.user.name}
							email={session.user.email}
							image={session.user.image}
						/>
					) : (
						<Link
							href="/login"
							className="rounded-sm bg-white px-4 py-1.5 text-sm font-bold text-black transition-opacity hover:opacity-80"
						>
							Sign in
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
}
