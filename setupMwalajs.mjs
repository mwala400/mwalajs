import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

/**
 * Function to install express in mwalajs and copy the folder into node_modules.
 */
async function setupMwalajs() {
    const projectDir = process.cwd(); // Get project root directory
    const mwalajsDir = path.join(projectDir, 'mwalajs'); // mwalajs folder
    const nodeModulesDir = path.join(projectDir, 'node_modules'); // node_modules
    const targetMwalajs = path.join(nodeModulesDir, 'mwalajs'); // Destination folder inside node_modules

    try {
        console.log(" Detecting Operating System...");
        const userOS = os.platform(); // Get user OS (win32, linux, darwin)
        console.log(` Running on: ${userOS === "win32" ? "Windows" : userOS === "darwin" ? "MacOS" : "Linux"}`);

        // Check if mwalajs exists
        if (!fs.existsSync(mwalajsDir)) {
            console.error(" Error: 'mwalajs' folder not found! Please ensure it exists.");
            return;
        }

        console.log(" Installing 'dependencies' inside 'mwalajs'...");
        execSync('npm install express --prefix mwalajs', { stdio: 'inherit' });

        // Ensure node_modules exists
        if (!fs.existsSync(nodeModulesDir)) {
            fs.mkdirSync(nodeModulesDir);
        }

        // Delete existing mwalajs in node_modules if present
        if (fs.existsSync(targetMwalajs)) {
            console.log(" Removing old 'mwalajs' from node_modules...");
            fs.removeSync(targetMwalajs);
        }

        console.log(" Copying 'mwalajs' to 'node_modules'...");
        fs.copySync(mwalajsDir, targetMwalajs, { overwrite: true });

        console.log(` Successfully installed 'dependencies' and moved 'mwalajs' to:`);
        console.log(` ${targetMwalajs}`);

    } catch (error) {
        console.error(" Error:", error.message);
    }
}

// Export the function so it can be used anywhere
export { setupMwalajs };

// Prevent auto-execution unless explicitly called (ES Module Fix)
if (import.meta.url === `file://${process.argv[1]}`) {
    setupMwalajs();
}
