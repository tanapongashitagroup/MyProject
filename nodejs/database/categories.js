db.setSchema({
  cover: String,
  catName: { th: String, en: String },
  detail: { th: String, en: String },
  slug: String,
  color: String,
  date: Number
}, 'categories')
var Categories = db.getDb('categories')
