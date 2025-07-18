const fs = require('fs');

if(fs.existsSync(__dirname + '/db.csv')){
    fs.rmSync(__dirname + '/db.csv', { recursive: true, force: true });
}

const files = fs.readdirSync(__dirname + '/input');
let _text = '';

for (let i = 0; i < files.length; i++) {
    const _t = fs.readFileSync(__dirname + '/input/' + files[i], 'utf-8').split('\n');
    for (let z = 0; z < _t.length; z++) {
        const _txt = _t[z];
        const _arr2 = _txt.split(',');
        if(_arr2[2] == 'RU' || _arr2[2] == 'KZ' || _arr2[2] == 'UA'){
            const _arr3 = _arr2[0].split('.');
            if(_arr3.length == 4 && /^\d+$/.test(_arr3[0]))
            _text += _arr2[0] + ',' + _arr2[1] + '\n';
        }
    }
}

fs.writeFileSync(__dirname + '/db.csv', _text);