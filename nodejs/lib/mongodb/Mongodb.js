var mongoose = require('mongoose')
class Mongodb {
    constructor(connect) {
        mongoose.Promise = global.Promise

        mongoose.connect(connect, { useMongoClient: true }).then(data => {
            console.log('connect database success')
        }).catch(err => {
            console.log(err.message)
        })
    }
    setSchema(schema, dbname) {
        var schema = new mongoose.Schema(schema, { collection: dbname })
        mongoose.model(dbname, schema)
    }
    getDb(dbname) {
        return mongoose.model(dbname)
    }

}
module.exports = Mongodb