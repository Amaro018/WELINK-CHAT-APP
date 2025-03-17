import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import env from "../utils/validateEnv";

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_KEY,
  api_secret: env.CLOUD_SECRET,
});

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile", // Folder in Cloudinary
      format: file.mimetype.split("/")[1], // Extract file format
      public_id: `${file.fieldname}-${Date.now()}`, // Unique file name
    };
  },
});

// File filter for image validation
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: any
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize Multer with Cloudinary storage
const profileupload = multer({ storage, fileFilter }).single("image");

export default profileupload;
