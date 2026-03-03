import { cn } from "@feather/ui";
import { ThemeProvider, ThemeToggle } from "@feather/ui/theme";
import { Toaster } from "@feather/ui/toast";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { WorkInProgressBanner } from "./_components/work-in-progress-banner";

import "~/app/styles.css";
import { Header } from "./_components/header";

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

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	preload: true,
});

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"bg-background text-foreground min-h-screen font-montserrat antialiased",
					montserrat.variable,
				)}
			>
				<ThemeProvider>
					<WorkInProgressBanner />
					<Header />
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
