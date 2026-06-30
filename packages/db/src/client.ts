import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";

import * as schema from "./schema";

const connectionString = env.POSTGRES_URL;

const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client, { schema, casing: "snake_case" });
export type DB = typeof db;
