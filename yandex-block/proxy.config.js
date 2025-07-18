module.exports = {
    apps : [{
        name   : "yandex blocker",
        script : "./proxy.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        instances : 1,
        max_memory_restart: "128M"
    }]
}