const { exec } = require('child_process');
const path = require('path');
var contPath;

const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${error.message}`);
            } else {
                resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
            }
        });
    });
};

const extractPathFromOutput = (output) => {
    const pathRegex = /(?:in:|find them in:)\s*(\/[^\s]+)/;
    const match = output.match(pathRegex);
    return match ? match[1] : null;
};


async function runCommandsSequentially() {
    try {
      
        const commands = [
            { cmd: 'cargo +nightly contract build', cwd: path.join(__dirname, 'abi') }, // Build a Rust contract
            { cmd: 'pwd', cwd: __dirname } 
        ];

        for (const { cmd, cwd } of commands) {
            try {
                const { stdout, stderr } = await runCommand(cmd, cwd);
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }
                if (stdout) {
                    console.log(`stdout: ${stdout}`);
                    
                    if (cmd.includes('cargo')) {
                        const extractedPath = extractPathFromOutput(stdout);
                        contPath = extractedPath;
                        if (extractedPath) {
                            console.log(`Extracted path: ${extractedPath}`);
                        } else {
                            console.log('No path found in output.');
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }
        return contPath;


    } catch (error) {
        console.error('Error:', error);
    }
}


module.exports = {
    runCommandsSequentially
};
