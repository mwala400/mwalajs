import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import os from 'os';

/**
 * Function to create a new project folder, copy required files, and auto-enter the directory.
 */
async function createProject() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter the name of the new project: ", (projectName) => {
        const currentDir = process.cwd(); // Get current working directory
        const newProjectPath = path.join(currentDir, projectName); // New project path

        try {
            // Check if the project folder already exists
            if (fs.existsSync(newProjectPath)) {
                console.error(`❌ Error: The folder '${projectName}' already exists.`);
                rl.close();
                return;
            }

            console.log(`📁 Creating project folder: ${newProjectPath}...`);
            fs.mkdirSync(newProjectPath); // Create the project folder

            // List of items to copy (excluding node_modules)
            const itemsToCopy = [
                "app.mjs", "controllers", "mwalajs", "package-lock.json", "routes",
                "views", "bin", "middlewares", "config", "models", "package.json",
                "README.md", "public", "runMigrations.mjs", "setupMwalajs.mjs"
            ];

            // Copy each item to the new project folder
            for (const item of itemsToCopy) {
                const srcPath = path.join(currentDir, item);
                const destPath = path.join(newProjectPath, item);

                if (fs.existsSync(srcPath)) {
                    console.log(`📦 Copying '${item}'...`);
                    fs.copySync(srcPath, destPath);
                }
            }

            console.log(`✅ Project '${projectName}' created successfully!`);
            console.log(`📂 Project directory: ${newProjectPath}`);

            // Detect OS and auto-enter the new project directory
            const platform = os.platform();

            if (platform === 'win32') {
                console.log("🔄 Switching to new project in Command Prompt...");
                exec(`start cmd.exe /K "cd /d ${newProjectPath}"`);
            } else if (platform === 'darwin') {
                console.log("🔄 Switching to new project in macOS Terminal...");
                exec(`open -a Terminal "${newProjectPath}"`);
            } else if (platform === 'linux') {
                console.log("🔄 Switching to new project in Linux Terminal...");
                exec(`gnome-terminal -- bash -c 'cd "${newProjectPath}" && bash'`);
            } else {
                console.log("⚠️ Unknown OS, please navigate manually:", newProjectPath);
            }

        } catch (error) {
            console.error("❌ Error:", error.message);
        } finally {
            rl.close();
        }
    });
}

// Export function for use in other files if needed
export { createProject };

// Prevent auto-execution unless explicitly called
if (import.meta.url === `file://${process.argv[1]}`) {
    createProject();
}
