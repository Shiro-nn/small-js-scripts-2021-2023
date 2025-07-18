const express = require('express');
const http = require('http');

(async()=>{
    const _web = express();
    _web
    .disable('x-powered-by')
    .use(require('./web'))
    .use(function(req, res){
        res.status(404).json({status:'error', message: 'not found'});
    })


    http.createServer(_web).listen(4326);
})();

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));