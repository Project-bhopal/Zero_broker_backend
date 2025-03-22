const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the path to the existing src directory (one level up)
const srcDir = path.join(__dirname, ".."); // Adjust this based on your folder structure
const uploadDir = path.join(srcDir, "uploads"); // Create 'uploads' inside the existing 'src'
const imagesDir = path.join(uploadDir, "images");
const videosDir = path.join(uploadDir, "videos");
const bannersDir = path.join(uploadDir, "banners");
const offersDir = path.join(uploadDir, "offers");

// Function to create directories if they don't exist
const createDirectories = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
  }
  if (!fs.existsSync(offersDir)) {
    fs.mkdirSync(offersDir, { recursive: true });
  }
  
};
createDirectories();

// Ensure that the "uploads" folder exists inside the existing "src" directory
if (fs.existsSync(srcDir)) {
  createDirectories();
} else {
  console.error(`Error: The "src" folder does not exist at ${srcDir}`);
}

// Define storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) createDirectories(); // Ensure folders exist before storing files
    if (file.mimetype.startsWith("image/")) {
      if (req.url.includes("/create")) {
        cb(null, bannersDir);
      }
      else if (req.baseUrl.includes("/offers")) {
        cb(null, offersDir);
      } 
      else{
        cb(null, imagesDir);
      }
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videosDir);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Define file filter for only images and videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

// Multer Upload Functions
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB per file
  fileFilter: fileFilter,
});

// module.exports = {
//   uploadSingle: (fieldName) => upload.single(fieldName),  // For single file upload
//   uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount), // For multiple file upload
//   uploadSingleVideo: (fieldName) => upload.single(fieldName),  // For single video upload
//   uploadMultipleVideos: (fieldName, maxCount) => upload.array(fieldName, maxCount), // For multiple video upload
// };
module.exports = {
  upload,
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  uploadSingleVideo: (fieldName) => upload.single(fieldName),
  uploadMultipleVideos: (fieldName, maxCount) => upload.array(fieldName, maxCount),
};

