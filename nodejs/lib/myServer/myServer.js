var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
class MyServer {

  constructor (port) {
    this.port = port
    this.app = express()
    this.server = require('http').Server(this.app)
  }
  initApp () {
    var allowCrossDomain = function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin, X-Session-ID')
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
      res.header('Access-Control-Allow-Credentials', true)
      res.header('Access-Control-Max-Age', '86400')
      next()
    }
    this.app.use(allowCrossDomain)
    this.app.use(express.static(__dirname + '/../../../dist'))
    this.app.use(bodyParser.json({ limit: '5mb' }))
    this.app.use('/uploads', express.static('uploads'))
    this.app.set('views', path.join(__dirname, '../../../dist'))
    this.app.engine('html', require('ejs').renderFile)
    this.server.listen(this.port, () => {
      console.log('app listening on port ' + this.port)
    })
  }
  getServer () {
    return this.server
  }
  getApp () {
    return this.app
  }
}

module.exports = MyServer
