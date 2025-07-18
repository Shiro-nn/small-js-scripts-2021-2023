const { spawn } = require('child_process');
const _dir = 'C:\\ProgramData\\MongoBackups';

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));

const kid = spawn('node', ['init.js', __dirname], {cwd: _dir});
kid.stdout.setEncoding('utf8');
kid.stdout.on('data', function(data) {
    console.log(data);
});
kid.on('close', function(code) {
    console.log('Скрипт установки завершен');
    setTimeout(() => process.exit(1), 22000);
});