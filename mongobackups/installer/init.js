const { exec } = require('child_process');
const fs = require('fs');

const _dir = 'C:\\ProgramData\\MongoBackups';

(async()=>{
    console.log('Начинаю установку..');
    //if(fs.existsSync(_dir)) fs.rmSync(_dir, {recursive: true, force: true});
    //fs.mkdirSync(_dir, {recursive: true});
    console.log('Копирую mongodump.exe');
    if(fs.existsSync(_dir + '\\mongodump.exe')) fs.rmSync(_dir + '\\mongodump.exe', {recursive: true, force: true});
    fs.copyFileSync((process.argv[2] || __dirname) + '\\bins\\mongodump.exe', _dir + '\\mongodump.exe');
    console.log('Копирую app.exe');
    try{
        try{await new Promise(res => exec('C:\\Windows\\system32\\sc.exe stop mongobackups.exe', () => setTimeout(() => res(), 1000)));}catch{}
        if(fs.existsSync(_dir + '\\app.exe')) fs.rmSync(_dir + '\\app.exe', {recursive: true, force: true});
        fs.copyFileSync((process.argv[2] || __dirname) + '\\bins\\app.exe', _dir + '\\app.exe');
    }catch{}
    console.log('Создаю сервис..');
    await SetupService();
    console.log('Установка завершена');
})();


/*
async function SetupService() {
    const { exec, execSync } = require('child_process');
    const _exist = await new Promise(res => {
        exec('C:\\Windows\\system32\\sc.exe query MongoBackups', (error) => res(error ? false : true));
    });
    console.log(_exist);
    if(_exist){
        await new Promise(res => exec('C:\\Windows\\system32\\sc.exe stop MongoBackups', () => res()));
        await new Promise(res => exec('C:\\Windows\\system32\\sc.exe start MongoBackups', () => res()));
        return;
    }
    await new Promise(res => exec(`C:\\Windows\\system32\\sc.exe create MongoBackups displayname="MongoBackups" start=auto binpath="${_dir}\\app.exe"`, () => res()));
    await new Promise(res => exec('C:\\Windows\\system32\\sc.exe start MongoBackups', () => res()));
};
*/

async function SetupService() {
    const Service = require('node-windows').Service;
    return new Promise(async res => {
        var svc = new Service({
            name: 'MongoBackups',
            description: 'Создает бэкап MongoDB',
            script: 'null.js', // just skip arguments..
            execPath: _dir + '\\app.exe',
            nodeOptions: ['--harmony']
        });

        const _exist = await new Promise(res => exec('C:\\Windows\\system32\\sc.exe query mongobackups.exe', (error) => res(error ? false : true)));
        
        if(svc.exists && !_exist){
            try{fs.rmSync(_dir + '\\daemon', {recursive: true, force: true});}catch{}
        }
        if(_exist){
            let started = false;
            setTimeout(() => __start(), 2000);
            svc.on('stop', () => __start());
            svc.restart();
            function __start() {
                if(started) return;
                svc.start();
                started = true;
                res();
            }
        }else{
            svc.on('install', () => {
                svc.start();
                res();
            });
            svc.install();
        }
    });
}