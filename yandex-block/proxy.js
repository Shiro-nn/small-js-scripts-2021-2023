const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'http://localhost:2600',
    changeOrigin: false,
    ws: true,
    onError: (err, req, res) => {try{
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Proxy error');
        console.log(err);
    }catch{}},
};

const blockAds = (req, res, next) => {
    try{ // yandex
        if(req.path.includes('an/')
        || req.path.includes('ads/')
        || req.path.includes('weather/_cry')
        || req.path.includes('set/s')
        || (req.path.includes('clck/') && !req.path.includes('clck/jsredir'))){
            res.destroy();
            return;
        }
    }catch{}
    try{ // youtube
        if(req.get('host').endsWith('youtube.com')){
            // https://jnn-pa.googleapis.com/$rpc/google.internal.waa.v1.Waa/GenerateIT
            if(req.path.includes('pagead')
            || req.path.includes('api/stats/ads')
            || req.path.includes('api/stats/qoe')
            || req.path.includes('ptracking')
            || req.path.includes('youtubei/v1/att/get')){
                res.destroy();
                return;
            }
        }
    }catch{}
    req.headers['x-forwarded-for'] = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    next();
};

const httpProxy = createProxyMiddleware({
    ...options,
    router: {
        'ya.ru': 'http://ya.ru',
        'yandex.ru': 'http://yandex.ru',
        'yandex.com': 'http://yandex.com',
        'yandex.net': 'http://yandex.net',

        'www.youtube.com': 'http://www.youtube.com',
        'youtube.com': 'http://youtube.com',
    },
});
const _http = express();
_http.disable("x-powered-by");
_http.use(blockAds);
_http.use(httpProxy);
{
    const server = _http.listen(80);
    server.on('upgrade', httpProxy.upgrade);
}

const httpsProxy = createProxyMiddleware({
    ...options,
    router: {
        'ya.ru': 'https://ya.ru',
        'yandex.ru': 'https://yandex.ru',
        'yandex.com': 'https://yandex.com',
        'yandex.net': 'https://yandex.net',

        'www.youtube.com': 'https://www.youtube.com',
        'youtube.com': 'https://youtube.com',
    },
});
const _https = express();
_https.disable("x-powered-by");
_https.use(blockAds);
_https.use(httpsProxy);
{
    const server = require('https').createServer({key: '', cert: ''}, _https);

    server.addContext('ya.ru', {
        key: require('./.crt/yaru').key,
        cert: require('./.crt/yaru').crt
    });

    server.addContext('yandex.ru', {
        key: require('./.crt/yandexru').key,
        cert: require('./.crt/yandexru').crt
    });

    server.addContext('yandex.com', {
        key: require('./.crt/yandexcom').key,
        cert: require('./.crt/yandexcom').crt
    });

    server.addContext('yandex.net', {
        key: require('./.crt/yandexnet').key,
        cert: require('./.crt/yandexnet').crt
    });

    server.addContext('youtube.com', {
        key: require('./.crt/youtube').key,
        cert: require('./.crt/youtube').crt
    });

    server.addContext('www.youtube.com', {
        key: require('./.crt/youtubewww').key,
        cert: require('./.crt/youtubewww').crt
    });

    server.listen(443);
    server.on('upgrade', httpsProxy.upgrade);
}
process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));