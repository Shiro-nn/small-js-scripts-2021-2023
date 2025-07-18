(async() => {
    const { exec } = require('child_process');
    await new Promise(res => exec('C:\\Windows\\system32\\sc.exe stop mongobackups.exe', () => setTimeout(() => res(), 1000)));
    await new Promise(res => exec('C:\\Windows\\system32\\sc.exe start mongobackups.exe', () => res()));
    console.log('Сервис перезагружен');
})();