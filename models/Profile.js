const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
     user: {
          type: Schema.Types.ObjectId,
     },
     name: {
          type: String,
     },
     email: {
          type: String,
     },
     desc: {
          type: String,
     },
     gender: {
          type: String,
     },
     date: {
          type: Date,
          default: Date.now
     }
});

module.exports = User = mongoose.model("Profile", ProfileSchema);