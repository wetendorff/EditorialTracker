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

		const upsertContentItem = db.prepare(`
      INSERT INTO "ContentItem" ("id", "title", "status", "authorId", "deadline", "type")
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT("id") DO UPDATE SET
        "title" = excluded."title",
        "status" = excluded."status",
        "authorId" = excluded."authorId",
        "deadline" = excluded."deadline",
        "type" = excluded."type"
    `);

		upsertUser.run("seed_erik", "Erik", "Erik", "test1234", "EDITOR");
		upsertUser.run("seed_carl", "Carl", "Carl", "test1234", "CONTRIBUTOR");

		upsertContentItem.run(
			"seed_content_erik_1",
			"Q3 Editorial Calendar",
			"Draft",
			"seed_erik",
			"2026-07-05T09:00:00.000Z",
			"Article",
		);
		upsertContentItem.run(
			"seed_content_erik_2",
			"Interview with Product Team",
			"Review",
			"seed_erik",
			null,
			"Podcast",
		);
		upsertContentItem.run(
			"seed_content_carl_1",
			"Launch Teaser Script",
			"Idea",
			"seed_carl",
			"2026-07-01T12:00:00.000Z",
			"Video",
		);
		upsertContentItem.run(
			"seed_content_carl_2",
			"How We Built the Tracker",
			"Published",
			"seed_carl",
			null,
			"Article",
		);

		console.log(
			"Seeded test users and content items for Erik (EDITOR) and Carl (CONTRIBUTOR)",
		);
	} finally {
		db.close();
	}
}

main();
