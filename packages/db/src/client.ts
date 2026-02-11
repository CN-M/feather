import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";

import * as schema from "./schema";

const connectioString = env.POSTGRES_URL;

const client = postgres(connectioString, { max: 1 });

export const db = drizzle(client, { schema, casing: "snake_case" });
