import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import os from 'os';

/**
 * Detect base source path from environment or defaults
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

    console.warn(" mwalajs source path not found. Using current directory.");
    return process.cwd(); // fallback
}

/**
 * Function to create a new project folder, copy required files, and auto-enter the directory.
 */
async function createProject() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(" Enter the name of the new project: ", async (projectName) => {
        const currentDir = process.cwd();
        const newProjectPath = path.join(currentDir, projectName);

        const mwalajsSourcePath = getMwalajsPath();

        try {
            if (fs.existsSync(newProjectPath)) {
                console.error(` Error: Folder '${projectName}' already exists.`);
                rl.close();
                return;
            }

            console.log(` Creating folder: ${newProjectPath}...`);
            fs.mkdirSync(newProjectPath);

            const itemsToCopy = [
                "app.mjs", "controllers", "mwalajs", "routes",
                "views", "middlewares", "models", "package.json",
                "README.md", "public"
            ];

            for (const item of itemsToCopy) {
                const src = path.join(mwalajsSourcePath, item);
                const dest = path.join(newProjectPath, item);

                if (fs.existsSync(src)) {
                    console.log(` Copying '${item}'...`);
                    fs.copySync(src, dest);
                } else {
                    console.warn(` '${item}' not found in source. Skipping...`);
                }
            }

            console.log(` Project '${projectName}' created successfully!`);
            console.log(` Location: ${newProjectPath}`);

            // Open terminal automatically
            const platform = os.platform();

            if (platform === 'win32') {
                exec(`start cmd.exe /K "cd /d ${newProjectPath}"`);
            } else if (platform === 'darwin') {
                exec(`open -a Terminal "${newProjectPath}"`);
            } else if (platform === 'linux') {
                // Try gnome-terminal, x-terminal-emulator, or konsole
                const termCmds = [
                    `gnome-terminal -- bash -c 'cd "${newProjectPath}" && bash'`,
                    `x-terminal-emulator -e 'bash -c "cd \\"${newProjectPath}\\"; exec bash"'`,
                    `konsole --workdir "${newProjectPath}"`
                ];
                let opened = false;

                for (const cmd of termCmds) {
                    try {
                        exec(cmd, (error) => {
                            if (!error && !opened) opened = true;
                        });
                        break;
                    } catch {}
                }

                if (!opened) {
                    console.log(" Please manually open the folder:", newProjectPath);
                }
            } else {
                console.log(" Unknown OS. Please open manually:", newProjectPath);
            }

        } catch (err) {
            console.error(" Project creation failed:", err.message);
        } finally {
            rl.close();
        }
    });
}

// Export if used as a module
export { createProject };

// Run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    createProject();
}
