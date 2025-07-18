const { bgBlue, black, green } = require('colors');
const os = require('os');
const disable = os.userInfo().homedir.toLowerCase().startsWith('c:\\windows\\system32');

function dateTimePad(value, digits){
    let number = value;
    while (number.toString().length < digits) {
        number = '0' + number;
    }
    return number;
}

function format(tDate){
  return (dateTimePad(tDate.getDate(), 2) + "." +
    dateTimePad((tDate.getMonth() + 1), 2) + "." +
    tDate.getFullYear() + " " +
    dateTimePad(tDate.getHours(), 2) + ":" +
    dateTimePad(tDate.getMinutes(), 2) + ":" +
    dateTimePad(tDate.getSeconds(), 2))
}

module.exports = class Logger {
    static log(content){
        if(disable) return;
        const date = `[${format(new Date(Date.now()))}]:`;
        return console.log(`${date} ${bgBlue('LOG')} ${content}`);
    }
    static warn(content){
        if(disable) return;
        const date = `[${format(new Date(Date.now()))}]:`;
        return console.log(`${date} ${black.bgYellow('WARN')} ${content}`);
    }
    static error(content){
        if(disable) return;
        const date = `[${format(new Date(Date.now()))}]:`;
        return console.log(`${date} ${black.bgRed('ERROR')} ${content}`);
    }
    static debug(content){
        if(disable) return;
        const date = `[${format(new Date(Date.now()))}]:`;
        return console.log(`${date} ${green('DEBUG')} ${content}`);
    }
};