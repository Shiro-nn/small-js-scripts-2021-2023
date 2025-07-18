module.exports = {
    apps : [{
        name   : "tcp proxy",
        script : "./index.js",
        exec_mode : "cluster",
        max_memory_restart: "100M"
    }]
}