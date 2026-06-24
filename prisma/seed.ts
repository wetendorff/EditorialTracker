import "dotenv/config";
import { Database } from "bun:sqlite";

function getDbPath(databaseUrl: string | undefined): string {
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not set");
	}

	if (!databaseUrl.startsWith("file:")) {
		throw new Error(`Unsupported DATABASE_URL format: ${databaseUrl}`);
	}

	return databaseUrl.replace(/^file:/, "");
}

function main() {
	const dbPath = getDbPath(process.env.DATABASE_URL);
	const db = new Database(dbPath);

	try {
		const upsertUser = db.prepare(`
      INSERT INTO "User" ("id", "username", "fullName", "password", "role")
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT("username") DO UPDATE SET
        "fullName" = excluded."fullName",
        "password" = excluded."password",
        "role" = excluded."role"
    `);

		upsertUser.run("seed_erik", "Erik", "Erik", "test1234", "EDITOR");
		upsertUser.run("seed_carl", "Carl", "Carl", "test1234", "CONTRIBUTOR");

		console.log("Seeded test users: Erik (EDITOR), Carl (CONTRIBUTOR)");
	} finally {
		db.close();
	}
}

main();
