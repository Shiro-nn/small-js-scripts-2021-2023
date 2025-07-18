const express = require('express');
const router = express.Router();

const exts = require('./modules/extensions');

const HttpsProxyAgent = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const nfetch = require('node-fetch');

const cachedReqs = [];

router.all('/', async(req, resSend) => {
	const ip = req.query.ip;
	if(!ip) return resSend.status(400).json({status:'error', message: 'ip query not found'});
	if(!exts.validateIp(ip)) return resSend.status(400).json({status:'error', message: 'this ip-address is invalid', ip});
    let globalSended = false;

    console.log('--------------------------');

    try{preGet('http://proxied:@soundcloud-proxy.fydne.dev:3128').then(()=>{}).catch(()=>{});}catch{}

    checkPublicProxies();

    setTimeout(() => {
        if(globalSended) return;
        globalSended = true;
        resSend.json({threatLevel: 'undefined', threatLevelNum: 0, threatList: [], crawler: ''});
    }, 10000);
    
    async function parseProxies(preProxies){
        console.log(`Proxy count: ${preProxies.length}`);
        for (let i = 0; i < preProxies.length; i++) {
            const _proxy = preProxies[i];
            try{preGet(_proxy).then(()=>{}).catch(()=>{});}catch{}
        }
    }
    
    async function preGet(proxy){
        if(globalSended) return;
        const res = await new Promise(async res => {
            let _sended = false;
            const params = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            try{
                if(proxy.startsWith('http')){
                    const proxyAgent = new HttpsProxyAgent(proxy);
                    params.agent = proxyAgent;
                }else{
                    const proxyAgent = new SocksProxyAgent(proxy);
                    params.agent = proxyAgent;
                }
            }catch{
                res(null);
                return;
            }

            setTimeout(() => {
                if(_sended) return;
                _sended = true;
                res(null);
            }, 5000);

            nfetch('https://db-ip.com/demo/home.php?s='+ip, params)
            .then((resp) => {
                if(_sended) return;
                _sended = true;
                res(resp);
            }).catch(() => {
                if(_sended) return;
                _sended = true;
                res(null);
            });
        });
        if(!res) throw new Error('Connection timed out');
        const _data = await res.json();
        if(!_data.demoInfo.threatLevel){
            throw new Error('unknow "threatLevel"');
        }
        
		try{
			let threatLevelNum = 0;
			switch (_data.demoInfo.threatLevel) {
				case 'low': threatLevelNum = 1; break;
				case 'medium': threatLevelNum = 2; break;
				case 'high': threatLevelNum = 3; break;
				default: break;
			}
            if(globalSended) return;
            globalSended = true;
			resSend.json({
                threatLevel: _data.demoInfo.threatLevel, 
                threatLevelNum,
                threatList: (_data.demoInfo.threatDetails ?? []),
                crawler: (_data.demoInfo.crawlerName ?? '')
            });
		}catch{}
    }

    async function checkPublicProxies(){
        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
                'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=socks4');
                const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
                for (let i = 0; i < _data.length; i++) {
                    const _proxy = _data[i];
                    _proxyArr.push('socks4://'+_proxy.ip+':'+_proxy.port);
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();

        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
                'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=socks5');
                const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
                for (let i = 0; i < _data.length; i++) {
                    const _proxy = _data[i];
                    _proxyArr.push('socks://'+_proxy.ip+':'+_proxy.port);
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();

        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
                'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=http');
                const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
                for (let i = 0; i < _data.length; i++) {
                    const _proxy = _data[i];
                    _proxyArr.push('http://'+_proxy.ip+':'+_proxy.port);
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();


        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const spys = await GetResponce('https://spys.me/socks.txt');
                if (spys != null) {
                    const arr = spys.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const str = arr[i];
                        const _proxy = str.split(' ')[0];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            _proxyArr.push('socks://' + _proxy);
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();

        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const spys = await GetResponce('https://spys.me/proxy.txt');
                if (spys != null) {
                    const arr = spys.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const str = arr[i];
                        const _proxy = str.split(' ')[0];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            _proxyArr.push('http://' + _proxy);
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();


        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=http');
                if (plist != null) {
                    const arr = plist.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const _proxy = arr[i];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            _proxyArr.push('http://'+_proxy);
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();
        
        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=socks4');
                if (plist != null) {
                    const arr = plist.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const _proxy = arr[i];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            _proxyArr.push('socks4://'+_proxy);
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();
        
        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=socks5');
                if (plist != null) {
                    const arr = plist.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const _proxy = arr[i];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            _proxyArr.push('socks://'+_proxy);
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();

        
        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&' +
                    'ping=&selectedType=HTTP');
                if (pscan != null) {
                    const arr = pscan.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const str = arr[i];
                        const _proxy = str.split('>')[1]?.split('<')[0];
                        if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                            const port = arr[i + 1].split('>')[1]?.split('<')[0];
                            if (port != null && port != undefined) {
                                _proxyArr.push('http://' + _proxy + ':' + port);
                            }
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();
        
        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&ping=&selectedType=SOCKS4');
                if (pscan != null) {
                    const arr = pscan.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const str = arr[i];
                        const _proxy = str.split('>')[1]?.split('<')[0];
                        if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                            const port = arr[i + 1].split('>')[1]?.split('<')[0];
                            if (port != null && port != undefined) {
                                _proxyArr.push('socks4://' + _proxy + ':' + port);
                            }
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();

        (async() => {
            let _proxyArr = [];
            if(globalSended) return;
            try{
                const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&ping=&selectedType=SOCKS5');
                if (pscan != null) {
                    const arr = pscan.split('\n');
                    for (let i = 0; i < arr.length; i++) {
                        const str = arr[i];
                        const _proxy = str.split('>')[1]?.split('<')[0];
                        if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                            const port = arr[i + 1].split('>')[1]?.split('<')[0];
                            if (port != null && port != undefined) {
                                _proxyArr.push('socks5://' + _proxy + ':' + port);
                            }
                        }
                    }
                }
            }catch{}
            if(globalSended) return;
            await parseProxies(_proxyArr);
        })();
        async function GetResponce(url){
            try{
                const _cache = cachedReqs.find(x => x.url == url);
                if(_cache){
                    if(Date.now() - _cache.date > 60000){
                        const index = cachedReqs.indexOf(_cache);
                        if(index > -1){
                            cachedReqs.splice(index, 1);
                        }
                    }else{
                        return _cache.text;
                    }
                }
            }catch{}

            const res = await fetch(url);
            const _text = await res.text();

            cachedReqs.push({
                url: url,
                text: _text,
                date: Date.now(),
            });

            return _text;
        }
    }
});


module.exports = router;