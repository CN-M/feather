import { baseConfig, restrictEnvAccess } from "@feather/eslint-config/base";
import { nextjsConfig } from "@feather/eslint-config/nextjs";
import { reactConfig } from "@feather/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig(
	{
		ignores: [".next/**"],
	},
	baseConfig,
	reactConfig,
	nextjsConfig,
	restrictEnvAccess,
);
