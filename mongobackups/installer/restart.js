const { execSync } = require('child_process');
const fs = require('fs');

const _dir = 'C:\\ProgramData\\MongoBackups';

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));

if(!fs.existsSync(_dir)) fs.mkdirSync(_dir, {recursive: true});

if(fs.existsSync(_dir + '\\restart.js')) fs.rmSync(_dir + '\\restart.js', {recursive: true, force: true});
fs.copyFileSync(__dirname + '\\restart.copy.js', _dir + '\\restart.js');

execSync(`powershell -Command "Start-Process \"node restart.exec.js\" -Verb RunAs"`);