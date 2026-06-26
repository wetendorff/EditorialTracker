import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.user.upsert({
		where: { id: "seed_erik" },
		create: {
			id: "seed_erik",
			username: "Erik",
			fullName: "Erik Eriksson",
			password: "test1234",
			role: "EDITOR",
		},
		update: { fullName: "Erik Eriksson", password: "test1234", role: "EDITOR" },
	});
	await prisma.user.upsert({
		where: { id: "seed_carl" },
		create: {
			id: "seed_carl",
			username: "Carl",
			fullName: "Carl Carlson",
			password: "test1234",
			role: "CONTRIBUTOR",
		},
		update: {
			fullName: "Carl Carlson",
			password: "test1234",
			role: "CONTRIBUTOR",
		},
	});

	await prisma.contentItem.upsert({
		where: { id: "seed_content_erik_1" },
		create: {
			id: "seed_content_erik_1",
			title: "Q3 Editorial Calendar",
			status: "Draft",
			authorId: "seed_erik",
			deadline: new Date("2026-07-05T09:00:00.000Z"),
			type: "Article",
		},
		update: {
			title: "Q3 Editorial Calendar",
			status: "Draft",
			authorId: "seed_erik",
			deadline: new Date("2026-07-05T09:00:00.000Z"),
			type: "Article",
		},
	});
	await prisma.contentItem.upsert({
		where: { id: "seed_content_erik_2" },
		create: {
			id: "seed_content_erik_2",
			title: "Interview with Product Team",
			status: "Review",
			authorId: "seed_erik",
			deadline: null,
			type: "Podcast",
		},
		update: {
			title: "Interview with Product Team",
			status: "Review",
			authorId: "seed_erik",
			deadline: null,
			type: "Podcast",
		},
	});
	await prisma.contentItem.upsert({
		where: { id: "seed_content_carl_1" },
		create: {
			id: "seed_content_carl_1",
			title: "Launch Teaser Script",
			status: "Idea",
			authorId: "seed_carl",
			deadline: new Date("2026-07-01T12:00:00.000Z"),
			type: "Video",
		},
		update: {
			title: "Launch Teaser Script",
			status: "Idea",
			authorId: "seed_carl",
			deadline: new Date("2026-07-01T12:00:00.000Z"),
			type: "Video",
		},
	});
	await prisma.contentItem.upsert({
		where: { id: "seed_content_carl_2" },
		create: {
			id: "seed_content_carl_2",
			title: "How We Built the Tracker",
			status: "Published",
			authorId: "seed_carl",
			deadline: null,
			type: "Article",
		},
		update: {
			title: "How We Built the Tracker",
			status: "Published",
			authorId: "seed_carl",
			deadline: null,
			type: "Article",
		},
	});
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
