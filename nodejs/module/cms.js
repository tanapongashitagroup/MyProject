var Categories = db.getDb('categories')
var Post = db.getDb('post')
var Session = db.getDb('session')

var AuthJWT = require('./../lib/auth-jwt/AuthJWT')
var authjwt = new AuthJWT(Session)

var CreateUpload = require('./../lib/createUpload/CreateUpload')
var up = new CreateUpload()

var ip_server = fn.ipServe()
var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js')
const fs = require('fs')

module.exports = (app) => {

  app.post('/categories/addCategories', (req, res) => {
    Categories.findOne({ cat_th: req.body.cat_th }).lean().exec((err, chk) => {
    })
  })

  app.get('/api/getAllCategories', (req, res) => {
    Categories.find().lean().exec((err, cat) => {
      if (err) {
        res.json({ resCode: 0, Msg: err })
      }else {
        Post.find({ status: 'public'}).lean().exec((err2, post) => {
          cat.forEach(i => {
            var find = post.filter(j => j.categories_id + '' == i._id + '')
            if (find) {
              i.num = find.length
            }
          })

          res.json({ resCode: 1, Msg: cat})
        })
      }
    })
  })

  app.post('/api/getCategoriesByID', (req, res) => {
    Categories.findOne({ _id: req.body._id }).lean().exec((err, cat) => {
      if (err) {
        res.json({ resCode: 0, Msg: err })
      }else {
        res.json({ resCode: 1, Msg: cat })
      }
    })
  })

  // ---- frola editor
  app.get('/api/imgfroala', (req, res) => {
    var list = []
    var path = up.getPath('uploads', 'froala').path
    fs.readdir(path, (err, files) => {
      files.forEach(file => {
        var img = ip_server + path.substr(1, path.length) + file
        list.push({ url: img, thumb: img, tag: 'xxx' })
      })
      res.json(list)
    })
  })

  // ---- frola editor
  app.post('/api/uploadfroala', function (req, res) {
    var path = up.getPath('uploads', 'froala').path
    FroalaEditor.Image.upload(req, path, function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err))
      }
      data.link = ip_server + data.link.substr(1, data.link.length)

      res.send(data)
    })
  })

  // ---- frola editor
  app.post('/api/deletefroala', (req, res) => {
    FroalaEditor.Image.delete(req.body.src.replace(ip_server, ''), function (err) {
      if (err) {
        res.json(err)
      } else {
        res.json(req.body.src.replace(ip_server, ''))
      }
    })
  })

  app.post('/api/createPost', authjwt.authRoute(), (req, res) => {

    Post.findOne({ slug: req.body.slug }).exec((err, chk) => {
      if (chk) {
        res.json({ resCode: 2, Msg: 'Title is same in system.' })
      }else {
        var base64Data = req.body.cover.split(',')
        var imgName = 'postCover_' + fn.getTime() + '.png'
        var path = up.getPath('uploads', 'post').path + imgName

        fs.writeFile(path, base64Data[1], 'base64', (err) => {
          var gen = new Post({
            cover: path.replace('.', ''),
            title: { en: req.body.title_en, th: req.body.title_th },
            slug: req.body.slug,
            content: { en: req.body.content_en, th: req.body.content_th },
            categories_id: req.body.categories_id,
            tags: req.body.tags,
            status: 'draft',
            staff_id: req.user.uid,
            date: fn.getTime()
          })

          gen.save((err2) => {
            if (err2) {
              res.json({ resCode: 0, Msg: err2 })
            }else {
              res.json({ resCode: 1, Msg: gen })
            }
          })
        })
      }
    })
  })

  app.get('/api/getPostBySlug/:slug', (req, res) => {
    Post.findOne({ slug: req.params.slug }).populate('categories_id').lean().exec((err, post) => {
      if (post) {
        Post.findOneAndUpdate({ _id: post._id }, { $inc: { pageview: +1 } }).lean().exec()
        res.json({ resCode: 1, Msg: post })
      }else {
        res.json({ resCode: 2, Msg: 'Post is empty.' })
      }
    })
  })

  app.get('/api/getAllPost', (req, res) => {
    var pop = [ { path: 'staff_id'}, {path: 'categories_id' } ]
    Post.find().populate(pop).sort({ date: 'desc' }).lean().exec((err, post) => {
      if (err) {
        res.json({ resCode: 0, Msg: err })
      }else {
        res.json({ resCode: 1, Msg: post })
      }
    })
  })

  app.post('/api/publicPost', authjwt.authRoute(), (req, res) => {
    Post.findOneAndUpdate({ _id: req.body._id }, { status: 'public', date: fn.getTime() }).exec((err, post) => {
      if (err) {
        res.json({ resCode: 0, Msg: err })
      }else {
        res.json({ resCode: 1, Msg: 'success' })
      }
    })
  })

  app.get('/api/search/:text', (req, res) => {
    var text = req.params.text
    if (/[`~,.<>;*':"/[\]|{}()?=_+-]/.test(req.params.text)) {
      text = ''
    }

    Post.find({status: 'public', $or: [{'title.th': new RegExp(text, 'i')}, {'content.th': new RegExp(text, 'i')}, {'tags': new RegExp(text, 'i')}]}).lean().exec((err, result) => {
      res.json(result)
    })
  })
}
