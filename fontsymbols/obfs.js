const fs = require('fs');
fs.readFile('./output.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    fs.writeFile('./output.txt', data.toString().replaceAll(' ', ''), 'utf-8', () => console.log('ended;'));
});