db.setSchema({
    uid: String,
    date: Number,
    secret: String,
    ip: String
}, 'session')
var Session = db.getDb('session')