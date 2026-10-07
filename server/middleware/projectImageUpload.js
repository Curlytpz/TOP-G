import multer from "multer";
import { AppError } from "../utils/appError.js";

export const projectImageFieldName = "images";
export const maxProjectImageBytes = 8 * 1024 * 1024;
export const maxProjectImageFiles = 6;

const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export function isSupportedImageFile(file) {
  const bytes = file?.buffer;
  if (!allowedMimeTypes.has(file?.mimetype) || !bytes || bytes.length < 12) return false;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return jpeg || png || webp;
}

export const projectImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxProjectImageBytes, files: maxProjectImageFiles },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new AppError("Only JPG, PNG, and WEBP files are allowed.", 422, "INVALID_IMAGE_TYPE"));
    }
    return callback(null, true);
  },
}).array(projectImageFieldName, maxProjectImageFiles);