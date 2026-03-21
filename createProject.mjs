// createProject.mjs
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import os from 'os';

/**
 * Detect base source path
 */
function getMwalajsPath() {
    const envPath = process.env.MWALAJSPATH;

    if (envPath && fs.existsSync(envPath)) return envPath;

    const defaultPaths = {
        win32: 'C:\\Program Files\\mwalajs',
        linux: '/usr/local/lib/mwalajs',
        darwin: '/usr/local/lib/mwalajs'
    };

    const fallback = defaultPaths[os.platform()];
    if (fs.existsSync(fallback)) return fallback;

    console.warn("⚠ mwalajs source path not found. Using current directory.");
    return process.cwd();
}

/**
 * Ask helper
 */
function askQuestion(rl, question) {
    return new Promise(resolve => {
        rl.question(question, answer => resolve(answer.trim()));
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
        // ✅ ONLY ONE SOURCE OF INPUT
        let projectName = projectArg?.trim();

        if (!projectName) {
            projectName = await askQuestion(rl, "Enter the name of the new project: ");
        }

        if (!projectName) {
            console.error("❌ Project name cannot be empty.");
            return;
        }

        const currentDir = process.cwd();
        const newProjectPath = path.join(currentDir, projectName);

        const mwalajsSourcePath = getMwalajsPath();

        if (fs.existsSync(newProjectPath)) {
            console.error(`❌ Error: Folder '${projectName}' already exists.`);
            return;
        }

        console.log(`Creating folder: ${newProjectPath}`);
        fs.mkdirSync(newProjectPath, { recursive: true });

        const itemsToCopy = [
            "app.mjs",
            "controllers",
            "migrations",
            "routes",
            "views",
            "middlewares",
            "models",
            "README.md",
            "public"
        ];

        for (const item of itemsToCopy) {
            const src = path.join(mwalajsSourcePath, item);
            const dest = path.join(newProjectPath, item);

            if (fs.existsSync(src)) {
                console.log(`Copying '${item}'...`);
                fs.copySync(src, dest);
            } else {
                console.warn(`⚠ '${item}' not found. Skipping...`);
            }
        }

        console.log(`\n✅ Project '${projectName}' created successfully!`);
        console.log(`📁 Location: ${newProjectPath}`);

    } catch (err) {
        console.error("❌ Project creation failed:", err.message);
    } finally {
        rl.close();
    }
}

/**
 * CLI run support
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    createProject(process.argv[2]);
}