import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

/**
 * Function to install mwalajs.
 * - If package.json exists, it proceeds to install.
 * - If not, it prompts user to auto-create or manually create.
 * - When auto-creating, it sets "type": "module" and "main": "app.mjs" by default.
 */
async function setupMwalajs() {
    const projectDir = process.cwd();
    const packageJsonPath = path.join(projectDir, 'package.json');

    try {
        console.log("Detecting Operating System...");
        const userOS = os.platform();
        console.log(`Running on: ${userOS === "win32" ? "Windows" : userOS === "darwin" ? "MacOS" : "Linux"}`);

        if (!fs.existsSync(packageJsonPath)) {
            console.log("No package.json found in the current directory.");
            const choice = await prompt("Do you want to create one now? (y/n): ");

            if (choice.toLowerCase() === 'y') {
                console.log("Initializing package.json...");
                execSync('npm init -y', { stdio: 'inherit' });

                // Modify package.json with defaults
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                pkg.type = "module";
                pkg.main = "app.mjs";
                fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
                console.log('package.json created with type: "module" and main: "app.mjs"');
            } else {
                console.log("Please create a package.json file manually using `npm init`.");
                rl.close();
                return;
            }
        }

        console.log("Installing mwalajs in current directory...");
        execSync('npm install mwalajs', { stdio: 'inherit' });
        console.log("mwalajs installed successfully.");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        rl.close();
    }
}

// Export the function
export { setupMwalajs };

// Only execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupMwalajs();
}
