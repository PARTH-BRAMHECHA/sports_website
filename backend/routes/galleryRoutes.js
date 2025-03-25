import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllGalleryItems, addGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Gallery routes
router.get('/', getAllGalleryItems);
router.post('/', verifyAdmin, upload.single('image'), addGalleryItem);
router.delete('/:id', verifyAdmin, deleteGalleryItem);

export default router;