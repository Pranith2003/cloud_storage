// models/file.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  storageType: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  selectedStorage: { type: String, required: true }  // New field to track storage selection
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
