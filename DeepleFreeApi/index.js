const translate = require('./translate');

const arrConstr = ([]).constructor;

let transResult = {};
let errorsTrans = [];
(async()=>{
for (let key in translate) {
    let suck = false;
    let trying = 0;
    while(!suck) {
        try {
            const getByKey = translate[key];
            const response = await fetch('https://api-free.deepl.com/v2/translate', {
                method: 'post',
                headers: {
                    'content-type':'application/json',
                    'Authorization': 'DeepL-Auth-Key 47faaf51-:fx'
                },
                body: JSON.stringify({
                    text: getByKey.constructor == arrConstr ? getByKey : [getByKey],
                    target_lang: 'RU',
                    source_lang: 'DE',
                }),
            });
            const result = await response.json();
            let resArr = [];
            for(let res in result.translations) {
                resArr.push(result.translations[res].text);
            }
            if (resArr.length == 0) {
                throw new Error('где перевод?????');
            }
            transResult[key] = resArr.length == 1 ? resArr[0] : resArr;
            suck = true;
            console.log(transResult[key])
        } catch (error) {
            console.error('Error of: ' + key);
            console.error(error);
            trying++;
            if (trying == 3) {
                suck = true;
                errorsTrans.push(key);
            }
            await new Promise(resolve => setTimeout(() => resolve(), 2000))
        }
    }
}
console.log(transResult)
require('fs').writeFileSync('./result.json', JSON.stringify(transResult), {flag:'w+'})
require('fs').writeFileSync('./result-errors.json', JSON.stringify(errorsTrans), {flag:'w+'})
})();