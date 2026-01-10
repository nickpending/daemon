/**
 * Build-time parser for daemon.md
 *
 * Reads public/daemon.md, parses sections, generates TypeScript data file.
 * Run with: bun scripts/parse-daemon.ts
 */

import type { DaemonSections, DaemonData, HeroData } from "../src/types/daemon.types";

const PROJECT_ROOT = import.meta.dir.replace("/scripts", "");
const DAEMON_MD_PATH = `${PROJECT_ROOT}/public/daemon.md`;
const OUTPUT_DIR = `${PROJECT_ROOT}/src/generated`;
const OUTPUT_PATH = `${OUTPUT_DIR}/daemon-data.ts`;

/**
 * Parse daemon.md into sections
 */
function parseDaemonMd(content: string): DaemonSections {
	const sections: DaemonSections = {};
	const lines = content.split("\n");
	let currentSection = "";
	let currentContent: string[] = [];

	for (const line of lines) {
		const sectionMatch = line.match(/^\[([A-Z_]+)\]$/);
		if (sectionMatch) {
			if (currentSection) {
				sections[currentSection as keyof DaemonSections] = currentContent.join("\n").trim();
			}
			currentSection = sectionMatch[1];
			currentContent = [];
		} else if (currentSection) {
			currentContent.push(line);
		}
	}

	if (currentSection) {
		sections[currentSection as keyof DaemonSections] = currentContent.join("\n").trim();
	}

	return sections;
}

/**
 * Extract list items from markdown content
 */
function parseList(content: string | undefined): string[] {
	if (!content) return [];

	const items: string[] = [];
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (trimmed.startsWith("- ")) {
			items.push(trimmed.slice(2));
		}
	}
	return items;
}

/**
 * Parse TELOS section into structured items
 */
function parseTelos(content: string | undefined): string[] {
	if (!content) return [];

	const items: string[] = [];
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		// Match lines like "- P0: description" or "- M1: description"
		if (trimmed.match(/^-\s*[PMG]\d*:/)) {
			items.push(trimmed.slice(2)); // Remove "- " prefix
		}
	}
	return items;
}

/**
 * Extract last updated date from daemon.md footer
 */
function parseLastUpdated(content: string): string {
	const match = content.match(/\*Last updated:\s*(\d{4}-\d{2}-\d{2})\*/);
	return match ? match[1] : new Date().toISOString().slice(0, 10);
}

/**
 * Transform raw sections into DaemonData
 */
function transformToDaemonData(sections: DaemonSections, rawContent: string): DaemonData {
	return {
		about: sections.ABOUT || "",
		mission: sections.MISSION || "",
		telos: parseTelos(sections.TELOS),
		currentLocation: sections.CURRENT_LOCATION || "",
		philosophy: sections.PHILOSOPHY || "",
		whatImBuilding: parseList(sections.WHAT_IM_BUILDING),
		preferences: parseList(sections.PREFERENCES),
		dailyRoutine: sections.DAILY_ROUTINE ? [sections.DAILY_ROUTINE] : [],
		favoriteBooks: parseList(sections.FAVORITE_BOOKS),
		favoriteMovies: parseList(sections.FAVORITE_MOVIES),
		favoriteTv: parseList(sections.FAVORITE_TV),
		predictions: sections.PREDICTIONS?.includes("To be added")
			? ["Observing, not predicting"]
			: parseList(sections.PREDICTIONS),
		lastUpdated: parseLastUpdated(rawContent),
	};
}

/**
 * Extract hero-specific data
 */
function extractHeroData(sections: DaemonSections): HeroData {
	const missionLines = (sections.MISSION || "").split(".");

	return {
		tagline: "The Context You Keep",
		location: sections.CURRENT_LOCATION || "",
		subtitle: missionLines[0] ? missionLines[0].trim() + "." : "",
	};
}

/**
 * Generate TypeScript output file
 */
function generateOutput(data: DaemonData, heroData: HeroData): string {
	return `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * Generated from public/daemon.md by scripts/parse-daemon.ts
 * To update, edit daemon.md and run: bun run parse-daemon
 *
 * Generated: ${new Date().toISOString()}
 */

import type { DaemonData, HeroData } from "../types/daemon.types";

export const daemonData: DaemonData = ${JSON.stringify(data, null, "\t")};

export const heroData: HeroData = ${JSON.stringify(heroData, null, "\t")};

/**
 * Tool count for dashboard (matches MCP server tools)
 */
export const toolCount = 14;
`;
}

// Main execution
async function main() {
	console.log("Parsing daemon.md...");

	// Read source file
	const file = Bun.file(DAEMON_MD_PATH);
	if (!(await file.exists())) {
		console.error(`Error: ${DAEMON_MD_PATH} not found`);
		process.exit(1);
	}

	const content = await file.text();

	// Parse sections
	const sections = parseDaemonMd(content);
	console.log(`Found ${Object.keys(sections).length} sections`);

	// Transform data
	const daemonData = transformToDaemonData(sections, content);
	const heroData = extractHeroData(sections);

	// Ensure output directory exists
	await Bun.$`mkdir -p ${OUTPUT_DIR}`.quiet();

	// Write output
	const output = generateOutput(daemonData, heroData);
	await Bun.write(OUTPUT_PATH, output);

	console.log(`Generated: ${OUTPUT_PATH}`);
	console.log(`  - ${daemonData.favoriteBooks.length} books`);
	console.log(`  - ${daemonData.favoriteMovies.length} movies`);
	console.log(`  - ${daemonData.telos.length} TELOS items`);
	console.log(`  - ${daemonData.whatImBuilding.length} projects`);
}

main();
