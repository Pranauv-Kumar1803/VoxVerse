const File = require("../models/File");
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true,
    cloud_name: 'dssfts8or',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadFile = async (req, res) => {
    const file = req.file;

    console.log(file);
    console.log(req.body.username);

    const tags = req.body.tags.split(',');

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video'
        });
        console.log('Upload successful:', result);

        const filename = path.basename(req.file.originalname, '.mp3');

        const newFile = new File({
            uploadedUser: req.body.username,
            tags: tags,
            publicId: result.public_id,
            fileName: filename,
            fileUrl: result.secure_url
        });

        await newFile.save();

        return res.status(201).json({ message: 'File Upload succesful!' });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('internal server error!')
    }
}

const getAllFiles = async (req, res) => {
    try {
        const result = await File.find();
        console.log(result)

        return res.json(result);
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}

const getFile = async (req, res) => {
    try {
        console.log('inside this', req.params)
        const fileDoc = await File.findOne({publicId: req.params.file});

        console.log(fileDoc)
        return res.json(fileDoc)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { uploadFile, getAllFiles, getFile }