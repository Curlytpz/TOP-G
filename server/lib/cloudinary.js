import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/env.js";
import { AppError } from "../utils/appError.js";

function ensureCloudinaryConfig() {
  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw new AppError("Image uploads are not configured yet.", 503, "UPLOAD_UNAVAILABLE");
  }
}

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export function uploadProjectImage(file, projectId) {
  ensureCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `top-g/projects/${projectId}`,
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        transformation: [{ quality: "auto", fetch_format: "auto", width: 1800, crop: "limit" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary did not return an image result."));
        resolve({
          publicId: result.public_id,
          imageUrl: cloudinary.url(result.public_id, {
            secure: true,
            fetch_format: "auto",
            quality: "auto",
            width: 1800,
            crop: "limit",
          }),
        });
      },
    );
    stream.end(file.buffer);
  });
}

export async function deleteProjectImage(publicId) {
  ensureCloudinaryConfig();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  if (result.result !== "ok") throw new AppError("We couldn't remove this image from storage. Please try again.", 502, "UPLOAD_DELETE_FAILED");
}