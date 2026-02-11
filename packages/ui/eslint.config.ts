import { defineConfig } from "eslint/config";

import { baseConfig } from "@feather/eslint-config/base";
import { reactConfig } from "@feather/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
