var Users = db.getDb('users')
var Session = db.getDb('session')
var AuthJWT = require('./../lib/auth-jwt/AuthJWT')
var authjwt = new AuthJWT(Session)
var bcrypt = require('bcrypt')

module.exports = (app) => {

    app.post('/api/auth', (req, res) => {
        var email = req.body.email
        var password = req.body.password
        var clientId = req.body.clientId;
        var ip = getCallerIP(req);
        Users.findOne({ email: email }).lean().exec().then(data => {
            bcrypt.compare(password, data.password, function(err, status) {
                if (err) {
                    res.status(404).end()
                } else {
                    if (status) {


                        var secret = new Date().getTime() + ''
                        Session.count({ _id: clientId, uid: data._id, ip: ip }, (err, count) => {
                            if (count == 0) {
                                var sess = new Session({ uid: data._id, date: new Date().getTime(), secret: secret, ip: ip })
                                sess.save(err => {
                                    if (err) { res.json(err) } else {
                                        var obj = { clientId: sess._id, uid: data._id + '', permission: data.permission }
                                        var token = authjwt.createToken(obj, secret)
                                        res.json({ session_id: sess._id, status: status, accessToken: token })
                                    }
                                })
                            } else {
                                Session.update({ _id: clientId, uid: data._id, ip: ip }, { date: new Date().getTime(), secret: secret }).exec()
                                var obj = { clientId: clientId, uid: data._id + '', permission: data.permission }
                                var token = authjwt.createToken(obj, secret)
                                res.json({ session_id: clientId, status: status, accessToken: token })
                            }
                        })
                    } else {
                        res.json({ status: status })

                    }
                }
            })
        }).catch(err => {})
    })

    app.get('/api/logout', authjwt.authRoute(), (req, res) => {
        var date = new Date()
        Session.update({ _id: req.user.clientId, uid: req.user.uid }, { secret: date.getTime() }).exec()
        res.json({ message: 'logout' })
    })

    app.get('/api', authjwt.authRoute(), (req, res) => {
        res.json({ status: true, user: req.user })
    })

    app.post('/api', authjwt.authRoute('admin'), (req, res) => {
        res.json({ status: true })
    })

    function getCallerIP(request) {
        var ip = request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress;
        ip = ip.split(',')[0];
        ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
        return ip;
    }
}