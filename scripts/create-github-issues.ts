#!/usr/bin/env tsx
/**
 * Generic script to create GitHub issues from a YAML definition file using GitHub REST API.
 *
 * Usage:
 *   yarn issues:dry-run issues.yaml --repo owner/repo
 *   yarn issues:create issues.yaml --repo owner/repo
 *
 * Environment Variables:
 *   GITHUB_TOKEN: GitHub Personal Access Token with 'repo' scope
 *   GITHUB_REPO: Repository in format 'owner/repo' (optional, can use --repo flag)
 *
 * YAML Format:
 *   issues:
 *     - title: Issue Title
 *       body: |
 *         Issue description in markdown.
 *       labels:
 *         - label1
 *         - label2
 *       assignees:
 *         - username1
 *       milestone: 1
 */

import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';

// ============================================================================
// Types
// ============================================================================

interface IssueDefinition {
	title: string;
	body?: string;
	labels?: string[];
	assignees?: string[];
	milestone?: number;
}

interface IssuesYaml {
	repository?: string;
	issues: IssueDefinition[];
}

interface CliOptions {
	file: string;
	repo: string;
	token: string;
	create: boolean;
}

interface GitHubIssueResponse {
	id: number;
	number: number;
	title: string;
	html_url: string;
	state: string;
}

interface GitHubLabel {
	id: number;
	name: string;
	color: string;
	description: string | null;
}

interface GitHubApiError {
	message: string;
	documentation_url?: string;
	errors?: Array<{
		resource: string;
		field: string;
		code: string;
	}>;
}

// ============================================================================
// Console Output Utilities
// ============================================================================

const colors = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	gray: '\x1b[90m'
};

function bold(text: string): string {
	return `${colors.bold}${text}${colors.reset}`;
}

function red(text: string): string {
	return `${colors.red}${text}${colors.reset}`;
}

function green(text: string): string {
	return `${colors.green}${text}${colors.reset}`;
}

function yellow(text: string): string {
	return `${colors.yellow}${text}${colors.reset}`;
}

function blue(text: string): string {
	return `${colors.blue}${text}${colors.reset}`;
}

function cyan(text: string): string {
	return `${colors.cyan}${text}${colors.reset}`;
}

function gray(text: string): string {
	return `${colors.gray}${text}${colors.reset}`;
}

// ============================================================================
// YAML Parser
// ============================================================================

async function loadIssuesFromYaml(filePath: string): Promise<IssuesYaml> {
	const absolutePath = resolve(filePath);
	const content = await readFile(absolutePath, 'utf-8');
	const parsed = parseYaml(content) as IssuesYaml;

	if (!parsed || !parsed.issues || !Array.isArray(parsed.issues)) {
		throw new Error('YAML must contain an "issues" array at the root level');
	}

	for (let i = 0; i < parsed.issues.length; i++) {
		const issue = parsed.issues[i];
		if (!issue.title || typeof issue.title !== 'string') {
			throw new Error(`Issue ${i + 1}: Missing or invalid "title" field`);
		}
	}

	return parsed;
}

// ============================================================================
// GitHub API Client
// ============================================================================

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(token: string): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'Content-Type': 'application/json'
	};
}

async function fetchRepositoryLabels(repo: string, token: string): Promise<Set<string>> {
	const url = `${GITHUB_API_BASE}/repos/${repo}/labels?per_page=100`;

	try {
		const response = await fetch(url, { headers: getHeaders(token) });

		if (!response.ok) {
			const error = (await response.json()) as GitHubApiError;
			console.warn(yellow(`Warning: Could not fetch repository labels: ${error.message}`));
			return new Set();
		}

		const labels = (await response.json()) as GitHubLabel[];
		return new Set(labels.map((l) => l.name));
	} catch (error) {
		console.warn(yellow(`Warning: Could not fetch repository labels: ${error}`));
		return new Set();
	}
}

async function createIssue(
	repo: string,
	token: string,
	issue: IssueDefinition
): Promise<GitHubIssueResponse> {
	const url = `${GITHUB_API_BASE}/repos/${repo}/issues`;

	const payload: Record<string, unknown> = {
		title: issue.title,
		body: issue.body ?? ''
	};

	if (issue.labels && issue.labels.length > 0) {
		payload.labels = issue.labels;
	}
	if (issue.assignees && issue.assignees.length > 0) {
		payload.assignees = issue.assignees;
	}
	if (issue.milestone) {
		payload.milestone = issue.milestone;
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: getHeaders(token),
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const error = (await response.json()) as GitHubApiError;
		throw new Error(error.message);
	}

	return response.json() as Promise<GitHubIssueResponse>;
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function printHelp(): void {
	console.log(`
${bold('GitHub Issue Creator')}

Create GitHub issues from a YAML definition file.

${bold('Usage:')}
  yarn issues:dry-run <yaml-file> [options]
  yarn issues:create <yaml-file> [options]

${bold('Arguments:')}
  yaml-file              Path to YAML file with issue definitions

${bold('Options:')}
  -r, --repo <owner/repo>   GitHub repository (or set GITHUB_REPO env var)
  -t, --token <token>       GitHub token (or set GITHUB_TOKEN env var)
  --create                  Actually create issues (default is dry run)
  -h, --help                Show this help message

${bold('Environment Variables:')}
  GITHUB_TOKEN    GitHub Personal Access Token with 'repo' scope
  GITHUB_REPO     Repository in format 'owner/repo'

${bold('YAML Format:')}
  issues:
    - title: Issue Title
      body: |
        Issue description in markdown.
      labels:
        - bug
        - enhancement
      assignees:
        - username
      milestone: 1

${bold('Examples:')}
  # Dry run (preview issues without creating)
  yarn issues:dry-run github_issues.yaml --repo owner/repo

  # Create issues
  yarn issues:create github_issues.yaml --repo owner/repo

  # Using environment variables
  GITHUB_TOKEN=ghp_xxx GITHUB_REPO=owner/repo yarn issues:create issues.yaml

${bold('Creating a GitHub Token:')}
  1. Go to https://github.com/settings/tokens
  2. Click "Generate new token" (classic)
  3. Select scope: 'repo' (Full control of private repositories)
  4. Generate token and copy it
  5. Export as environment variable: export GITHUB_TOKEN=ghp_xxxxx
`);
}

function parseCliArgs(): CliOptions {
	const { values, positionals } = parseArgs({
		options: {
			repo: { type: 'string', short: 'r' },
			token: { type: 'string', short: 't' },
			create: { type: 'boolean', default: false },
			help: { type: 'boolean', short: 'h' }
		},
		allowPositionals: true
	});

	if (values.help) {
		printHelp();
		process.exit(0);
	}

	// Get YAML file path
	const file = positionals[0];
	if (!file) {
		console.error(red('Error: YAML file path is required'));
		console.error(gray('Run with --help for usage information'));
		process.exit(1);
	}

	// Get token from args or env
	const token = values.token ?? process.env.GITHUB_TOKEN;
	if (!token) {
		console.error(red('Error: GitHub token is required'));
		console.error(gray('Set GITHUB_TOKEN environment variable or use --token flag'));
		process.exit(1);
	}

	// Repo will be resolved later (can come from YAML file too)
	const repo = values.repo ?? process.env.GITHUB_REPO ?? '';

	return {
		file,
		repo,
		token,
		create: values.create ?? false
	};
}

// ============================================================================
// Main Function
// ============================================================================

async function createGitHubIssues(options: CliOptions): Promise<void> {
	const dryRun = !options.create;

	// Load issue definitions
	console.log(`Loading issues from: ${cyan(options.file)}`);
	const data = await loadIssuesFromYaml(options.file);

	// Determine repository
	const repoName = options.repo || data.repository;
	if (!repoName) {
		console.error(red('Error: Repository is required'));
		console.error(
			gray('Set GITHUB_REPO environment variable, use --repo flag, or specify in YAML file')
		);
		process.exit(1);
	}

	console.log(`Target repository: ${cyan(repoName)}`);
	console.log(`Dry run: ${dryRun ? yellow('true') : green('false')}`);
	console.log(gray('-'.repeat(80)));

	// Get available labels in repository
	let availableLabels = new Set<string>();
	if (!dryRun) {
		availableLabels = await fetchRepositoryLabels(repoName, options.token);
		if (availableLabels.size > 0) {
			console.log(`Repository has ${availableLabels.size} labels`);
		}
	}

	// Create issues
	const issuesData = data.issues;
	console.log(`Found ${bold(String(issuesData.length))} issues to create\n`);

	let createdCount = 0;
	let skippedCount = 0;

	for (let idx = 0; idx < issuesData.length; idx++) {
		const issueData = issuesData[idx];
		const title = issueData.title;
		const body = issueData.body ?? '';
		const labels = issueData.labels ?? [];
		const assignees = issueData.assignees ?? [];
		const milestoneNumber = issueData.milestone;

		if (!title) {
			console.log(yellow(`Warning: Issue ${idx + 1}: Skipping (no title)`));
			skippedCount++;
			continue;
		}

		console.log(`\n${'='.repeat(80)}`);
		console.log(`Issue ${idx + 1}: ${bold(title)}`);
		console.log(`${'='.repeat(80)}`);
		console.log(`Labels: ${labels.length > 0 ? labels.join(', ') : gray('None')}`);
		console.log(`Assignees: ${assignees.length > 0 ? assignees.join(', ') : gray('None')}`);
		if (milestoneNumber) {
			console.log(`Milestone: #${milestoneNumber}`);
		}
		console.log(`\nBody preview (first 200 chars):`);
		console.log(gray(body.slice(0, 200) + (body.length > 200 ? '...' : '')));

		// Validate labels (if not dry run)
		if (!dryRun && availableLabels.size > 0) {
			const invalidLabels = labels.filter((label) => !availableLabels.has(label));
			if (invalidLabels.length > 0) {
				console.log(
					yellow(`\nWarning: Labels not found in repository: ${invalidLabels.join(', ')}`)
				);
				console.log(gray('   These labels will be created automatically.'));
			}
		}

		if (dryRun) {
			console.log(green(`\n[DRY RUN] Would create issue: ${title}`));
			createdCount++;
			continue;
		}

		// Create the issue
		try {
			const issue = await createIssue(repoName, options.token, issueData);
			console.log(green(`\nCreated issue #${issue.number}: ${issue.html_url}`));
			createdCount++;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.log(red(`\nFailed to create issue: ${message}`));
			skippedCount++;
		}
	}

	// Summary
	console.log(`\n${'='.repeat(80)}`);
	console.log(bold('SUMMARY'));
	console.log(`${'='.repeat(80)}`);
	console.log(`Total issues: ${issuesData.length}`);
	console.log(`Created: ${createdCount}`);
	console.log(`Skipped: ${skippedCount}`);

	if (dryRun) {
		console.log(blue(`\nThis was a dry run. Use --create to actually create the issues.`));
	}
}

// ============================================================================
// Entry Point
// ============================================================================

async function main(): Promise<void> {
	try {
		const options = parseCliArgs();
		await createGitHubIssues(options);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(red(`\nError: ${message}`));
		process.exit(1);
	}
}

main();
