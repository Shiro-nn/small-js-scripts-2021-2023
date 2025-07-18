const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    webroot: './www',
    allow_origin: '*',
    api: true
  },
  https: {
    port: 8443,
    key: './private.txt',
    cert: './certificate.crt',
  },
  auth: {
    api: true,
    api_user: 'admin',
    api_pass: 'admin',
    play: true,
    publish: true,
    secret: ''
  }
};

var nms = new NodeMediaServer(config)
nms.run();