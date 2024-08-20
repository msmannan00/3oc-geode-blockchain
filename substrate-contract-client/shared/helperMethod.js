const {exec} = require('child_process');
const path = require('path');
let contPath;

const runCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    exec(`/usr/bin/dash -c "cd ${cwd} && ${command}"`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
      } else {
        resolve({stdout: stdout.trim(), stderr: stderr.trim()});
      }
    });
  });
};
const extractPathFromOutput = (output) => {
  const pathRegex = /(?:in:|find them in:)\s*(\/[^\s]+)/;
  const match = output.match(pathRegex);
  return match ? match[1] : null;
};


async function buildContract() {
  try {

    const commands = [
      {cmd: 'cargo +nightly contract build', cwd: 'abi'},
      {cmd: 'pwd', cwd: ''}
    ];
    for (const {cmd, cwd} of commands) {
      try {
        const {stdout, stderr} = await runCommand(cmd, cwd);
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
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


module.exports = {
  buildContract: buildContract
};
