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
			body: "Drafting the Q3 editorial calendar to align content pipeline with product launches and seasonal themes.\n\nKey sections: tech reviews, industry interviews, and newsletter planning. First draft due July 10.",
		},
		update: {
			title: "Q3 Editorial Calendar",
			status: "Draft",
			authorId: "seed_erik",
			deadline: new Date("2026-07-05T09:00:00.000Z"),
			type: "Article",
			body: "Drafting the Q3 editorial calendar to align content pipeline with product launches and seasonal themes.\n\nKey sections: tech reviews, industry interviews, and newsletter planning. First draft due July 10.",
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
			body: "Sit-down with the product team to discuss upcoming features and roadmap. Focus on the new analytics dashboard shipping in Q4. Audio recording already captured, transcript being edited.",
		},
		update: {
			title: "Interview with Product Team",
			status: "Review",
			authorId: "seed_erik",
			deadline: null,
			type: "Podcast",
			body: "Sit-down with the product team to discuss upcoming features and roadmap. Focus on the new analytics dashboard shipping in Q4. Audio recording already captured, transcript being edited.",
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
			body: "Short teaser video script for the upcoming product launch. Target: 60 seconds, platform: Instagram and LinkedIn. Draft storyboard attached.",
		},
		update: {
			title: "Launch Teaser Script",
			status: "Idea",
			authorId: "seed_carl",
			deadline: new Date("2026-07-01T12:00:00.000Z"),
			type: "Video",
			body: "Short teaser video script for the upcoming product launch. Target: 60 seconds, platform: Instagram and LinkedIn. Draft storyboard attached.",
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
			body: "Behind-the-scenes piece on building the internal editorial tracker. Covers tech stack decisions, migration from spreadsheets, and lessons learned. Published June 2026.",
		},
		update: {
			title: "How We Built the Tracker",
			status: "Published",
			authorId: "seed_carl",
			deadline: null,
			type: "Article",
			body: "Behind-the-scenes piece on building the internal editorial tracker. Covers tech stack decisions, migration from spreadsheets, and lessons learned. Published June 2026.",
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
