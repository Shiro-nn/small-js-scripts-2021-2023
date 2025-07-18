const logger = require('./modules/logger');
const fs = require('fs');
const { execFile } = require('child_process');
const _file = 'C:\\ProgramData\\MongoBackups\\mongodump.exe';

module.exports = async(opt) => {
    if(!fs.existsSync(_file)){
        logger.error('mongodump.exe not found');
        return true;
    }
    return new Promise(res => {
        execFile(_file, [`--uri="${opt.url}"`, '--out', opt.path], (error, stdout, stderr) => res(error ? true : false));
    });
};