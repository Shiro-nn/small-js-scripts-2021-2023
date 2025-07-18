const logger = require('./modules/logger');
const backup = require('./backup');
const fs = require('fs');

const _dir = 'C:\\MongoBackups';

const checkConfigs = async() => {
    if(!fs.existsSync(_dir)) fs.mkdirSync(_dir, {recursive: true});
    const _config = _dir + '\\config.js';
    if(!fs.existsSync(_config)){
        fs.writeFileSync(_config, 'module.exports = ['
        +'\n    /*'
        +'\n    {'
        +'\n        name: \'mydb\', // Название базы данных (для директории бэкапов), может быть произвольным'
        +'\n        url: \'mongodb://localhost\', // Ссылка-подключение к MongoDB'
        +'\n        interval: 4, // Задает интервал для бэкапа БД (В часах)'
        +'\n        removeOld: 30, // Автоматически удаляет старые бэкапы, которые превышают заданное кол-во (В днях) *В любом случае оставляет один бэкап.'
        +'\n    },'
        +'\n    { // Для бэкапа нескольких баз данных'
        +'\n        name: \'mydb2\','
        +'\n        url: \'mongodb://user:password@host:port\','
        +'\n        interval: 12,'
        +'\n        removeOld: 15,'
        +'\n    },'
        +'\n    */'
        +'\n];');
    }
    const config = require(_config);
    return config;
};

setTimeout(() => {
    try{ClearDaemonLogs()}catch{}
}, 100);

(async() => {
    logger.log('Started');
    const configs = await checkConfigs();
    logger.debug('DataBases count: ' + configs.length);

    for (let i = 0; i < configs.length; i++) {
        backup(configs[i], i + 1);
    }
})();

async function ClearDaemonLogs() {
    const daemonDir = 'C:\\ProgramData\\MongoBackups\\daemon';
    if(!fs.existsSync(daemonDir)) return logger.debug('Daemon directory not found');
    const files = fs.readdirSync(daemonDir);
    for (let i = 0; i < files.length; i++) {
        const _file = files[i];
        if(_file.endsWith('.log')){
            try{fs.rmSync(daemonDir + '\\' + _file, {recursive: true, force: true});}catch{}
        }
    }
}