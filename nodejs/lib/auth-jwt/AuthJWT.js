var jwt = require('jsonwebtoken')

var modeldb
class AuthJWT {
    constructor(model) {
        modeldb = model
    }
    createToken(obj, secretKey) {
        var token = jwt.sign(obj, secretKey, { expiresIn: '7d' })
        return token
    }
    authRoute(permission) {
        return (req, res, next) => {
            try {
                var de = jwt.decode(req.query.accessToken)


                if (de) {
                    modeldb.findOne({ _id: de.clientId, uid: de.uid }).lean().exec().then(data => {
                        if (data) {
                            var decoded = jwt.verify(req.query.accessToken, data.secret)

                            if (!permission) {
                                req.user = decoded
                                return next()
                            } else {
                                if (decoded.permission == permission || decoded.permission == 'admin') {
                                    req.user = decoded
                                    return next()
                                } else {
                                    res.json({ name: 'PermissionDenied', status: false })
                                }
                            }

                        } else {
                            res.json({ name: 'JsonWebTokenError', message: 'no secretKey' });
                        }



                    }).catch(err => {

                        res.json({ name: 'JsonWebTokenError', message: err.message })
                    })
                } else {
                    res.json({ name: 'tokenInvalid', status: false })
                }
            } catch (err) {

                res.json(err)
            }

        }
    }

}
module.exports = AuthJWT