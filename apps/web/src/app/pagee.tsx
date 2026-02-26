import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6">
			<div className="w-full max-w-3xl">
				<div className="rounded-2xl border bg-card p-12 shadow-sm">
					<div className="space-y-8 text-center">
						<div className="text-sm uppercase tracking-widest text-muted-foreground">
							Full-Stack Social Platform
						</div>

						<h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
							Feather
						</h1>

						<p className="text-xl leading-relaxed text-muted-foreground">
							A modern, full-stack Twitter clone built to explore scalable
							architecture, real-time interactions, and clean domain-driven
							design.
						</p>

						<p className="text-lg leading-relaxed text-muted-foreground">
							Feather is a production-grade social platform powered by
							end-to-end type safety, shared backend logic across web and mobile
							clients, and infrastructure designed for extensibility.
						</p>

						<div className="pt-2 text-sm uppercase tracking-widest text-muted-foreground">
							Launching Soon
						</div>

						<div className="pt-4 text-base">
							<span className="text-muted-foreground">
								In the meantime, follow development by watching the{" "}
							</span>
							<Link
								href="https://github.com/cn-m/feather"
								target="_blank"
								className="font-medium underline underline-offset-4 hover:text-foreground"
							>
								GitHub repository
							</Link>
							.
						</div>

						<div className="pt-6 text-sm text-muted-foreground">
							Built with Next.js, TypeScript, tRPC, Drizzle ORM, PostgreSQL,
							TailwindCSS, Turborepo, and AWS.
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
