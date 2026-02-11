import postgres from "postgres";
import { env } from "./env";

(async () => {
	const url = new URL(env.POSTGRES_URL);
	const dbName = url.pathname.slice(1);

	// 1. Create a connection to the 'postgres' system database
	// We overwrite the pathname to ensure we can actually connect
	url.pathname = "/postgres";
	const adminSql = postgres(url.href, { max: 1 });

	try {
		// 2. Check if the database exists
		const exists = await adminSql`
      SELECT 1 FROM pg_database WHERE datname = ${dbName}
    `;

		if (exists.length === 0) {
			console.log(`🚀 Creating database: ${dbName}`);
			// Note: CREATE DATABASE cannot be run inside a transaction
			await adminSql.unsafe(`CREATE DATABASE "${dbName}"`);
		} else {
			console.log(`✅ Database ${dbName} already exists`);
		}
	} catch (error) {
		console.error("❌ Error during DB creation:", error);
	} finally {
		await adminSql.end();
	}

	// 3. Connect to the NEW database to ensure extensions exist
	const appSql = postgres(env.POSTGRES_URL, { max: 1 });
	try {
		console.log(`🛠️  Ensuring extensions in ${dbName}...`);
		await appSql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
		console.log(`✨ Extensions ready`);
	} catch (error) {
		console.error("❌ Error creating extension:", error);
	} finally {
		await appSql.end();
	}
})();
