"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "~/auth/client";

type UserMenuProps = {
	name: string;
	email: string;
	image?: string | null;
};

export function UserMenu({ name, email, image }: UserMenuProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Close on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	async function handleSignOut() {
		setLoading(true);
		await authClient.signOut();
		router.push("/login");
		router.refresh();
	}

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="relative" ref={ref}>
			{/* Trigger */}
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-3 rounded-full px-2 py-1.5 transition-colors hover:bg-muted cursor-pointer"
			>
				{/* Avatar */}
				<div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
					{image ? (
						<Image
							src={image}
							alt={name}
							className="h-full w-full object-cover"
							fill
							sizes="40px"
						/>
					) : (
						<span className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
							{initials}
						</span>
					)}
				</div>

				{/* Name */}
				<div className="hidden text-left sm:block">
					<p className="text-sm font-medium leading-tight text-foreground">
						{name}
					</p>
					<p className="text-xs leading-tight text-muted-foreground truncate max-w-[140px]">
						{email}
					</p>
				</div>

				{/* Chevron */}
				<svg
					className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<title>Chevron</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			{open && (
				<div className="absolute right-0 top-full z-50 mt-2 w-64 animate-in fade-in-0 zoom-in-95 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
					{/* User header */}
					<div className="px-4 py-3">
						<p className="text-sm font-semibold text-foreground truncate">
							{name}
						</p>
						<p className="text-xs text-muted-foreground truncate">{email}</p>
					</div>

					<div className="h-px bg-border" />

					{/* Menu items */}
					<div className="p-1">
						<button
							type="button"
							onClick={handleSignOut}
							disabled={loading}
							className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50 cursor-pointer"
						>
							{loading ? (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
							) : (
								<svg
									className="h-4 w-4 text-muted-foreground"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
								>
									<title>Sign Out</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
									/>
								</svg>
							)}
							<span>{loading ? "Signing out..." : "Sign out"}</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
