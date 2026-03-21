import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import os from 'os';
import { fileURLToPath } from 'url';

/**
 * Get global template path (FIXED)
 */
function getMwalajsPath() {
    const envPath = process.env.MWALAJSPATH;

    if (envPath && fs.existsSync(envPath)) {
        return envPath;
    }

    /**
     * IMPORTANT FIX:
     * Get path of installed npm package, NOT cwd
     */
    try {
        const modulePath = path.dirname(fileURLToPath(import.meta.url));

        // go up to package root
        const rootPath = path.resolve(modulePath, '..');

        if (fs.existsSync(path.join(rootPath, 'app.mjs'))) {
            return rootPath;
        }
    } catch (err) {}

    const fallbackPaths = {
        win32: 'C:\\Program Files\\mwalajs',
        linux: '/usr/local/lib/mwalajs',
        darwin: '/usr/local/lib/mwalajs'
    };

    const fallback = fallbackPaths[os.platform()];

    if (fallback && fs.existsSync(fallback)) {
        return fallback;
    }

    throw new Error("❌ MwalaJS template source not found. Set MWALAJSPATH.");
}

/**
 * Ask helper
 */
function askQuestion(rl, question) {
    return new Promise(resolve => {
        rl.question(question, ans => resolve(ans.trim()));
    });
}

/**
 * Create project
 */
export async function createProject(projectArg) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        let projectName = projectArg?.trim();

        if (!projectName) {
            projectName = await askQuestion(rl, "Enter project name: ");
        }

        if (!projectName) {
            console.error("❌ Project name required");
            return;
        }

        const newProjectPath = path.join(process.cwd(), projectName);

        const templatePath = getMwalajsPath();

        if (!fs.existsSync(templatePath)) {
            throw new Error("Template path not found: " + templatePath);
        }

        if (fs.existsSync(newProjectPath)) {
            console.error(`❌ Folder already exists: ${projectName}`);
            return;
        }

        console.log(`📦 Creating project: ${projectName}`);
        console.log(`📁 From template: ${templatePath}`);

        fs.mkdirSync(newProjectPath, { recursive: true });

        const itemsToCopy = [
            "app.mjs",
            "controllers",
            "migrations",
            "routes",
            "views",
            "middlewares",
            "models",
            "public",
            "README.md"
        ];

        let copied = 0;

        for (const item of itemsToCopy) {
            const src = path.join(templatePath, item);
            const dest = path.join(newProjectPath, item);

            if (fs.existsSync(src)) {
                console.log(`✔ Copying ${item}`);
                fs.copySync(src, dest);
                copied++;
            } else {
                console.warn(`⚠ Missing template item: ${item}`);
            }
        }

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`✅ Project created: ${projectName}`);
        console.log(`📁 Location: ${newProjectPath}`);
        console.log(`📦 Files copied: ${copied}/${itemsToCopy.length}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    } catch (err) {
        console.error("❌ Create project failed:", err.message);
    } finally {
        rl.close();
    }
}

/**
 * CLI support
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    createProject(process.argv[2]);
}