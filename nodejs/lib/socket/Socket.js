class Socketio {
    constructor(server) {
        this.io = require('socket.io')(server)
        this.io.on('connection', function(socket) {
            console.log('connect')
        })
    }
}
module.exports = Socketio