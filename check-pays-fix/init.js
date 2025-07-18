const {Client} = require('qurre-socket');
const _client = new Client(2693, '37.18.21.237');

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', async(req, res) => {
    if(!_client.connected){
        _client.emit('pay', req.body.payment)
        res.sendStatus(400);
        return;
    }
    _client.emit('pay', req.body.payment)
    res.sendStatus(200);
});
const http = require('http');
http.createServer(app).listen(2519, 'localhost');