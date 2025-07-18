const electron = require("electron");
electron.app.commandLine.appendSwitch('proxy-server', 'soundcloud-proxy.fydne.dev:3128');
electron.app.on('login', async (event, webContents, request, authInfo, callback) => {
    if(authInfo.isProxy && authInfo.port == 3128){
        callback('proxied', '');
    }
});
require('../app.asar');