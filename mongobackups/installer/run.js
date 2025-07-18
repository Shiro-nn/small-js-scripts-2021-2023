const { execSync } = require('child_process');
const fs = require('fs');

const _dir = 'C:\\ProgramData\\MongoBackups';

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));

if(!fs.existsSync(_dir)) fs.mkdirSync(_dir, {recursive: true});

if(fs.existsSync(_dir + '\\init.js')) fs.rmSync(_dir + '\\init.js', {recursive: true, force: true});
fs.copyFileSync(__dirname + '\\init.js', _dir + '\\init.js');

if(fs.existsSync(_dir + '\\package.json')) fs.rmSync(_dir + '\\package.json', {recursive: true, force: true});
fs.copyFileSync(__dirname + '\\package.json', _dir + '\\package.json');

execSync('npm i', {cwd: _dir});

execSync(`powershell -Command "Start-Process \"node run.exec.js\" -Verb RunAs"`);