db.setSchema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  permission: String,
  date: Number
}, 'users')
var Users = db.getDb('users')
