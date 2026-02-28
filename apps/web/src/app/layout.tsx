import { cn } from "@feather/ui";
import { ThemeProvider, ThemeToggle } from "@feather/ui/theme";
import { Toaster } from "@feather/ui/toast";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthShowcase } from "./_components/auth-showcase";

import "~/app/styles.css";

export const metadata: Metadata = {
	metadataBase: new URL(
		env.VERCEL_ENV === "production"
			? "https://feather.mbhalati.com"
			: "http://localhost:3000",
	),
	title: "Feather",
	description: "Full-Stack Social Platform",
	openGraph: {
		title: "Feather",
		description: "Full-Stack Social Platform",
		url: "https://feather.mbhalati.com",
		siteName: "Feather",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"bg-background text-foreground min-h-screen font-sans antialiased",
					geistSans.variable,
					geistMono.variable,
				)}
			>
				<ThemeProvider>
					<header className="flex w-full border-b py-4 px-10 justify-end">
						<AuthShowcase />
					</header>
					<TRPCReactProvider>{props.children}</TRPCReactProvider>
					<div className="absolute right-4 bottom-4">
						<ThemeToggle />
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
