import multer from 'multer';
import path from 'path';

// Use memoryStorage so files are kept in memory (Buffer) for direct Cloudinary upload
const storage = multer.memoryStorage();

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images and PDFs only!'));
    }
}

// Init upload
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Middleware for multiple specific files (Aadhar, Driving License)
export const uploadRideDocuments = upload.fields([
    { name: 'aadharCard', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1 }
]);

// Middleware for a single profile picture upload
export const uploadProfilePhoto = upload.single('profilePicture');
