const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => { 
    try {
        if(!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Function to handle the stream upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        }

        // Call the stream upload function
        const result = await streamUpload(req.file.buffer);
        
        res.status(200).json({
            success: true,
            url: {imageUrl: result.secure_url}  
        });
        
    } catch (error) {
        console.error('Upload error:', error); 
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
});

module.exports = router; 