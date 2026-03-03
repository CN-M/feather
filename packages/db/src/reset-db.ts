import postgres from "postgres";
import { env } from "./env";

(async () => {
	console.log("🧼 Preparing to wipe database...");

	// Connect to your target database
	const sql = postgres(env.POSTGRES_URL, { max: 1 });

	try {
		// 1. Get all table names in the 'public' schema
		// This query finds all tables you've created (ignoring internal postgres tables)
		const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name != 'pg_stat_statements';
        `;

		if (tables.length === 0) {
			console.log("✅ Database is already empty (no tables found).");
			return;
		}

		// 2. Format names for the query (wrapped in quotes for safety)
		const tableList = tables.map((t) => `"${t.table_name}"`).join(", ");

		console.log(`🧨 Truncating: ${tableList}`);

		// 3. The "Nuclear" command
		// CASCADE: wipes likes, follows, and tweets when users are wiped
		// RESTART IDENTITY: resets all IDs back to 1
		await sql.unsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`);

		console.log("✨ Database successfully reset to a clean state.");
	} catch (error) {
		console.error("❌ Error during database reset:", error);
	} finally {
		await sql.end();
	}
})();
