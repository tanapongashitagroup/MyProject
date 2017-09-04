'use strict'
var MyServer = require('./lib/myServer/myServer')
var Mongodb = require('./lib/mongodb/Mongodb')

global.db = new Mongodb('mongodb://mrtor:Pbird7979!@27.254.81.130:23166/jpossible')

global.mongoose = require('mongoose')
require('./database/users')
require('./database/session')
require('./database/categories')
require('./database/post')

global.fn = require('./tools.js')

var sv = new MyServer(3000)
sv.initApp()
sv.getApp().get('/useragent', (req, res) => {
    var requestIp = require('request-ip');
    var useragent = require('express-useragent');
    var source = req.headers['user-agent']
        // var clientIp = getCallerIP(req);
    var ua = useragent.parse(source);
    // var ip = require("ip");
    res.json(source);

});



require('./module/cms')(sv.getApp())
require('./module/auth')(sv.getApp())

sv.getApp().get('*', function(req, res) {
    res.render('index.html')
})