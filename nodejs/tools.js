var crypto = require('crypto')
var algorithm = 'aes-256-ctr'
var password = 'BzPbird!@#$%7979Nba$hixxdd'
var ObjectID = require('mongodb').ObjectID

module.exports = new function () {
  this.ObjectId = function (id) {
    return new ObjectID(id)
  }

  this.isEmpty = function (str) {
    return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null || str.length == 0
  }

  this.getTime = function () {
    var d = new Date()
    return Math.floor(d.getTime() / 1000)
  }

  this.encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  this.decrypt = function (text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }

  this.ipServe = function () {
    return 'http://localhost:3000'
  // return 'http://api.jpossible.ashita.io/'
  }
}
