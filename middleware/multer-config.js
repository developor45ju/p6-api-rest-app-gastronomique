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
        callback(null, 'image');
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        console.log(name);
        const extension = MIME_TYPE[file.mimetype];
        console.log(extension);
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage }).single('image');