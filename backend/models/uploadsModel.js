const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({}, {strict: false});

const image = mongoose.model('uploads.files', uploadSchema);

module.exports = { image };