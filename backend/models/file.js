const mongoose = require("mongoose");
const FileSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("file", FileSchema);
module.exports = File;
