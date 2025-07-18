const fs = require('fs');
fs.readFile('./font.svg', function read(err, data) {
    if (err) {
        throw err;
    }
    let _str = '';
    const arr = data.toString().split('\n');
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];//.split('"')[0] unicode="
        if(el.includes('unicode="')){
            const _e = el.split('unicode="')[1].split('"')[0];
            if(_e != null && _e != undefined) _str += _e + ' ';
        }
    }
    fs.writeFile('./output.txt', _str, 'utf-8', () => console.log('ended;'));
});