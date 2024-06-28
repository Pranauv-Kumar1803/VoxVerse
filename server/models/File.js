const mongoose = require("mongoose");

const schema = mongoose.Schema;

const fileSchema = new schema({
    uploadedUser: {
        type: String,
        required: true
    },
    publicId: { // unique as given by cloudinary itself
        type: String,
        required: true,
        unique: true
    },
    fileUrl: { // real file url to fetch and give in chunks
        type: String,
        required: true
    },
    fileName: { // used for user interface showing
        type: String,
        required: true
    },
    tags: [String]
}, {timestamps: true, versionKey: 0});

module.exports = mongoose.model('File', fileSchema);