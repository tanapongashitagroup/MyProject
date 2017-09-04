db.setSchema({
  cover: String,
  title: { en: String, th: String },
  slug: String,
  content: { en: String, th: String },
  categories_id: { type: mongoose.Schema.ObjectId, ref: 'categories' },
  tags: Array,
  status: String,
  staff_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
  pageview: Number,
  date: Number
}, 'post')
var Post = db.getDb('post')
