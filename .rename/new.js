const fs = require('fs');
const dir = 'C:/Users/fydne1/Desktop/code/js/web-sites/scpsl.store/scp-web/dashboard/public/img/visual/models/TutorialE11Rifle/';
const current = fs.readdirSync(dir+'prepare/')
fs.readdir(dir+'textures/', async function (err, files) {
    files.forEach(file => {
        const arr = file.split('.');
        const name = file.replace(arr[arr.length-1], '');
        if(current.some(x => x == name+'jpg')){
            fs.unlinkSync(dir+'textures/'+file);
            fs.renameSync(dir+'prepare/'+name+'jpg', dir+'textures/'+file);
        }
    });
});
console.log('ok');