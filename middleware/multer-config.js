const multer = require('multer');

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg': 'svg'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.FOLDER_IMAGES);
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPE[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage }).single('image');