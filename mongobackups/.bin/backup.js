const logger = require('./modules/logger');
const fs = require('fs');

const _dir = 'C:\\MongoBackups\\Backups';
const stringConstructor = 'hi'.constructor;
const objectConstructor = ({}).constructor;

const dump = require('./dump');

module.exports = async(config, i) => {
    if(config.constructor != objectConstructor) return logger.warn(`Config of ${i} is not a object`);
    if(config.name.constructor != stringConstructor) return logger.warn(`DB name of ${i} config is not a string (${config.name})`);
    if(config.url.constructor != stringConstructor) return logger.warn(`DB url of ${i} config is not a string`);
    if(isNaN(config.interval)) return logger.warn(`Interval of ${i} config is not a number`);
    if(isNaN(config.removeOld)) return logger.warn(`RemoveOld of ${i} config is not a number`);

    if(0.05 >= config.interval) return logger.warn(`Interval can not be 0.05 or lower (${config.interval}) of config ${i}`);
    
    logger.debug(`Started backup of ${i} databases`);
    try{Backup(config);}catch{}
    setInterval(() => {
        try{Backup(config);}catch{}
    }, config.interval * 3600000); // 1000 * 60 * 60
};

async function Backup(config) {
    const _dbDir = `${_dir}\\${config.name}`;
    const _path = `${_dbDir}\\${GetDate(new Date())}`;
    if(fs.existsSync(_path)) fs.rmSync(_path, { recursive: true, force: true });
    fs.mkdirSync(_path, {recursive: true});
    const _error = await dump({
        url: config.url,
        path: _path
    });
    if(_error) logger.error('An error occurred while creating the backup');
    let dirs = fs.readdirSync(_dbDir);
    dirs = DeleteEmptyDirs(dirs, _dbDir);
    dirs = ParseDirs(dirs);
    const _date = Date.now();
    for (let i = 0; i < dirs.length - 1; i++) {
        const dirParam = dirs[i];
        if(_date - dirParam.date > 86400000 * config.removeOld){ // 1000 * 60 * 60 * 24
            fs.rmSync(`${_dbDir}\\${dirParam.dir}`, { recursive: true, force: true });
        }
    }
    logger.debug(`Created backup at "${config.name}"`);
}

function DeleteEmptyDirs(dirs, root) {
    let arr = [];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        if(fs.existsSync(root + '\\' + dir)){
            const _files = fs.readdirSync(root + '\\' + dir);
            if(_files.length < 1){
                try{fs.rmSync(root + '\\' + dir, { recursive: true, force: true });}catch{}
            }
            else arr.push(dir);
        }
    }
    return arr;
}

function ParseDirs(dirs) {
    let arr = [];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        const date = ParseDate(dir);
        arr.push({dir, date});
    }
    arr = arr.sort((a, b) => a.date - b.date);
    return arr;
}

function ParseDate(date) {
    const datetime_regex = /(\d\d)\.(\d\d)\.(\d\d\d\d)\s(\d\d)-(\d\d)/;
    const first_date_arr = datetime_regex.exec(date);
    const datetime = new Date(first_date_arr[3], first_date_arr[2] - 1, first_date_arr[1], first_date_arr[4], first_date_arr[5]);
    return datetime.getTime();
}

function GetDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${dateTimePad(day, 2)}.${dateTimePad(month, 2)}.${dateTimePad(year, 4)} ${dateTimePad(hour, 2)}-${dateTimePad(minute, 2)}`;
}
function dateTimePad(value, digits){
    let number = value;
    while(number.toString().length < digits){
        number = "0" + number;
    }
    return number;
}