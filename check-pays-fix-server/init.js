const send = require('./send');
const {Server} = require('qurre-socket');
const _server = new Server(2693, '37.18.21.237');
_server.on('connection', (sock)=>{
    sock.on('pay', ([code]) => send(code));
});
_server.initialize();