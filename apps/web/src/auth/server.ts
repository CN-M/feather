import "server-only";

import { initAuth } from "@feather/auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

import { env } from "../env";

const baseUrl =
	env.VERCEL_ENV === "production"
		? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
		: env.VERCEL_ENV === "preview"
			? `https://${env.VERCEL_URL}`
			: "http://localhost:3000";

export const auth = initAuth({
	baseUrl,
	productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "https://feather.mbhalati.com/"}`,
	secret: env.AUTH_SECRET,
	googleClientId: env.GOOGLE_CLIENT_ID,
	googleClientSecret: env.GOOGLE_CLIENT_SECRET,
	extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
	auth.api.getSession({ headers: await headers() }),
);
