var fs = require('fs')

class CreateUpload {

  getPath (folder, namefile) {
    var d = new Date()
    var namefull = './' + folder + '/' + namefile + '/'
    var path = namefull + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/'
    try {
      if (!fs.existsSync(namefull + d.getFullYear())) {
        fs.mkdirSync(namefull + d.getFullYear())
      }
      if (!fs.existsSync(namefull + d.getFullYear() + '/' + (d.getMonth() + 1))) {
        fs.mkdirSync(namefull + d.getFullYear() + '/' + (d.getMonth() + 1))
      }
      if (!fs.existsSync(namefull + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate())) {
        fs.mkdirSync(namefull + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate())
      }

      return { 'status': true, 'path': path, msg: '' }
    } catch (err) {
      return { 'status': false, 'path': path, 'msg': err.message }
    }
  }

}
module.exports = CreateUpload
