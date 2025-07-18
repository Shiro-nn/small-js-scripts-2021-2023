const net = require('net');

const remote = {
    port: 2467,
    ip: '45.142.122.184'
}
const server = net.createServer(function(sock) {
    console.log('Socket connected');
    const client = new net.Socket();
    let connected = false;
    let cached_messages = [];

    setInterval(() => {
        if (!client.writable) {
            return;
        }
        if (cached_messages.length == 0) {
            return;
        }

        cached_messages.forEach(message => {
            client.write(message);
        });

        cached_messages = [];
    }, 1000);

    sock.on('data', function(data) {
        if (!client.writable) {
            cached_messages.push(data);
            return;
        }
        client.write(data);
    });

    sock.once('close', () => {
        console.log('Destroied socket');
        connected = false;
        destroy();
    });
    sock.on('error', () => {});

    client.on('data', function(data) {
        sock.write(data);
    });
    client.once('close', () => {
        console.log('Destroied client');
        connected = false;
        destroy();
    });
    client.once('error', () => {
        console.log('Destroied client');
        connected = false;
        destroy();
    });
    client.connect(remote.port, remote.ip, () => {
        console.log('Client connected');
        connected = true;
    });

    function destroy() {
        sock.removeAllListeners();
        sock.end();
        sock.destroy();
        sock.unref();
        sock.removeAllListeners();

        client.end();
        client.destroy();
        client.unref();
        client.removeAllListeners();
    }
});

server.listen(2467, '0.0.0.0');