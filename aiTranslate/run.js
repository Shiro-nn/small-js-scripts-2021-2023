const fs = require('fs');
const path = require('path');
const https = require('https');

const readline = require('readline');
const sharp = require('sharp');

const fileTypeFromFile = require('file-type').fromFile;

let filesPath = null;
const lang = 'RUS';
const translator = 'deepl'; // deepl / gpt3.5

const checkPath = async() => {
    const runFromNode = process.argv[1] == __dirname;
    if(process.argv.length > (runFromNode ? 2 : 1) && fs.existsSync(process.argv[runFromNode ? 2 : 1])){
        filesPath = process.argv[1];
        return;
    }
    console.log('Specify the path to the folder with the images you want to translate');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    await new Promise(res => {
        rl.on('line', (input) => {
            input = input.trim();
            if(!fs.existsSync(input)){
                console.log(`Path "${input}" doesn't exist`);
                return;
            }
            filesPath = input;
            res();
        });
    });
    rl.close();
};

const uploadFile = async(filePath, fileName) => {
    if(!fs.existsSync(filePath)){
        console.log(`Path "${filePath}" doesn't exist`);
        return;
    }
    const ftype = await fileTypeFromFile(filePath);

    if (ftype == undefined) {
        return;
    }
    
    const form = new FormData();
    const blob = new Blob([fs.readFileSync(filePath)]);
    form.append('file', blob, 'translate.' + ftype.ext);
    form.append('target_language', lang);
    form.append('detector', 'default');
    form.append('direction', 'default');
    form.append('translator', translator);
    form.append('size', 'L');
    form.append('retry', 'true');

    const res = await fetch('https://api.cotrans.touhou.ai/task/upload/v1', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
        },
        body: form,
    });
    const rep = await res.text();

    // GET https://api.cotrans.touhou.ai/task/${id}/status/v1
    try{
        const json = JSON.parse(rep);
        if(json.error_id && json.error_id.length > 1){
            console.log(`[${fileName}] Error ocurred: ${rep}`);
            ReRunIfError();
            return;
        }
        
        let completed = false;
        while(!completed){
            await new Promise(res => setTimeout(() => res(), 15000));
            const res = await fetch(`https://api.cotrans.touhou.ai/task/${json.id}/status/v1`);
            const statusJson = await res.json();
            if(statusJson.type == 'result'){
                const fileResultPath = path.join(filesPath, 'translated', fileName);
                if(statusJson.result.translation_mask.startsWith('data:')){
                    fs.copyFileSync(filePath, fileResultPath);
                    completed = true;
                    continue;
                }
                const fileProcessingPath = path.join(filesPath, 'translated', 'processing-' + fileName);
                const file = fs.createWriteStream(fileProcessingPath);
                await new Promise(res => {
                    https.get(statusJson.result.translation_mask, (response) => {
                        response.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            res();
                            console.log(`${fileName}: Translated`);
                        });
                    });
                });
                completed = true;
                sharp(fileProcessingPath)
                .toBuffer({ resolveWithObject: true }) 
                .then(({ data, info }) => { 
                    sharp(filePath)
                    .composite([{ 
                        input: data
                    }])
                    .toFile(fileResultPath, (err) => {
                        if(err) console.log('Image process error: ' + err);
                        try{fs.rmSync(fileProcessingPath, { recursive: true });}catch{}
                    });
                })
            }else if(statusJson.type == 'error'){
                completed = true;
                console.log(`[${fileName}] Error ocurred: ${rep}`);
                ReRunIfError();
                return;
            }else{
                console.log(`${fileName}: status: ${statusJson.type}; pos: ${statusJson.pos};`);
            }
        }
    }catch(e){
        console.log(`[${fileName}] Error ocurred before parsing: ${rep}; ${e}`);
        ReRunIfError();
    }

    async function ReRunIfError(){
        await new Promise(res => setTimeout(() => res(), 60000));
        try{ uploadFile(filePath, fileName); }
        catch(e) { console.error(e); }
    }
}

const init = async() => {
    await checkPath();
    console.log('------');
    fs.mkdirSync(path.join(filesPath, 'translated'), { recursive: true });
    const files = fs.readdirSync(filesPath);
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const filePath = path.join(filesPath, fileName);
        if(fs.lstatSync(filePath).isFile()){
            try{ uploadFile(filePath, fileName); }
            catch(e) { console.error(e); }
            await new Promise(res => setTimeout(() => res(), 20000));
        }
    }
};

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err));

init();