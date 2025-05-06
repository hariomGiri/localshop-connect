import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different types of uploads
const productUploadsDir = path.join(uploadsDir, 'products');
const shopUploadsDir = path.join(uploadsDir, 'shops');
const idProofsDir = path.join(uploadsDir, 'id-proofs');
const businessDocsDir = path.join(uploadsDir, 'business-docs');

// Create these directories if they don't exist
[productUploadsDir, shopUploadsDir, idProofsDir, businessDocsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create subdirectories based on file type
    let uploadPath = uploadsDir;
    let uploadSubdir = '';

    if (file.fieldname === 'idProof') {
      uploadSubdir = 'id-proofs';
      uploadPath = path.join(uploadsDir, uploadSubdir);
    } else if (file.fieldname === 'businessDocument') {
      uploadSubdir = 'business-docs';
      uploadPath = path.join(uploadsDir, uploadSubdir);
    } else if (file.fieldname === 'image' || file.fieldname.includes('product')) {
      uploadSubdir = 'products';
      uploadPath = path.join(uploadsDir, uploadSubdir);
    } else if (file.fieldname.includes('shop')) {
      uploadSubdir = 'shops';
      uploadPath = path.join(uploadsDir, uploadSubdir);
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Store the uploadSubdir in the request object for later use
    req.uploadSubdir = uploadSubdir;

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
  const ext = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (ext && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, .gif, and .pdf files are allowed!'));
  }
};

// Create multer upload instance
const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Custom middleware to process the file path after upload
const processFilePath = (req, res, next) => {
  // If there are no files, continue
  if (!req.file && !req.files) {
    return next();
  }

  // Process single file upload
  if (req.file) {
    // Store the relative path instead of the absolute path
    const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
    req.file.path = relativePath;
  }

  // Process multiple files upload
  if (req.files) {
    Object.keys(req.files).forEach(fieldname => {
      req.files[fieldname].forEach(file => {
        // Store the relative path instead of the absolute path
        const relativePath = path.relative(process.cwd(), file.path).replace(/\\/g, '/');
        file.path = relativePath;
      });
    });
  }

  next();
};

// Create a wrapper for the upload middleware
const upload = {
  single: (fieldname) => {
    return [multerUpload.single(fieldname), processFilePath];
  },
  array: (fieldname, maxCount) => {
    return [multerUpload.array(fieldname, maxCount), processFilePath];
  },
  fields: (fields) => {
    return [multerUpload.fields(fields), processFilePath];
  },
  none: () => {
    return [multerUpload.none(), processFilePath];
  }
};

export default upload;
