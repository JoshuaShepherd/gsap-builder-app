---
mode: agent
---
QUICK PROMPT — “Make it run & push to GitHub”

Goal:
Take the app(s) in this workspace from current state → running locally → build succeeds → pushed to a new GitHub repo under JoshuaShepherd. Keep changes minimal and non-destructive.

Strict rules:
	•	Don’t delete files or rewrite the stack.
	•	Make the smallest possible fixes to get install → build → dev working.
	•	Never commit secrets. Use .env.example placeholders and .gitignore .env.

Steps (apply per app folder you detect):
	1.	Detect apps: List app folders (look for package.json). For each app, note framework and package manager from lockfile.
	2.	Branch: git checkout -b chore/run-<appName> (if repo already exists) OR prepare to init fresh.
	3.	Install: Use the detected package manager. Respect any Node engine; otherwise use LTS.
	4.	Minimal fixes to run:
	•	Add/adjust scripts to include at least: dev, build, start.
	•	Resolve obvious type/import/config errors (only what’s needed to build/run).
	•	If env vars required, create .env.example with placeholders and keep .env untracked.
	5.	Verify:
	•	build completes without errors.
	•	dev server starts; quick smoke on main route(s) (no fatal console errors).
	6.	Docs (tiny): Update/ create README.md with: prerequisites, install, dev, build, start, env var list.
	7.	GitHub:
	•	If not a repo: git init, commit, create new repo named <folderName> under JoshuaShepherd, set origin, push main.
	•	If already a repo: commit to current remote; if remote missing, create and push.
	8.	Done note: Create/append a root APPS_MINI_INDEX.md listing each app, its repo URL, and whether build/dev worked.

Acceptance criteria (for each app):
	•	npm|pnpm|yarn install succeeds.
	•	build succeeds.
	•	dev runs without fatal errors on main pages.
	•	.env.example exists and .env is gitignored.
	•	Repo is on GitHub under JoshuaShepherd with code pushed to main.
	•	README shows how to run.

Start now:
	•	Scan the workspace, list detected apps with chosen package manager and Node version.
	•	Confirm the order you’ll process them in, then execute the steps above for each app, one by one.