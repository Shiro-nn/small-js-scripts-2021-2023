const fs = require('fs');
const dir = 'C:/Users/fydne/Desktop/code/js/my/scp-web/dashboard/public/img/visual/models/ChaosInsurgency/';
fs.readdir(dir, async function (err, files) {
    files.forEach(file => {
        if(file.includes('-min')){
            fs.rename(dir+file, dir+file.replaceAll('-min', ''), () => {});
        }
    });
});