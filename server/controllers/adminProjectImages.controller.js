import { prisma } from "../lib/prisma.js";
import { deleteProjectImage, uploadProjectImage } from "../lib/cloudinary.js";
import { isSupportedImageFile } from "../middleware/projectImageUpload.js";
import { deleteProjectImageParamsSchema, projectImageParamsSchema, projectImageUploadSchema } from "../schemas/projectImage.schema.js";
import { AppError } from "../utils/appError.js";

const safeImageSelect = { id: true, imageUrl: true, imageType: true, createdAt: true };

function invalidUpload() {
  return new AppError("Please choose an image type and one or more valid image files.", 422, "VALIDATION_ERROR");
}

export async function uploadAdminProjectImages(request, response, next) {
  try {
    const params = projectImageParamsSchema.safeParse(request.params);
    const body = projectImageUploadSchema.safeParse(request.body);
    if (!params.success || !body.success || !Array.isArray(request.files) || request.files.length === 0) throw invalidUpload();
    if (request.files.some((file) => !isSupportedImageFile(file))) {
      throw new AppError("Only valid JPG, JPEG, PNG, and WEBP image files are allowed.", 422, "VALIDATION_ERROR");
    }

    const project = await prisma.project.findUnique({ where: { id: params.data.id }, select: { id: true } });
    if (!project) throw new AppError("Project not found.", 404, "NOT_FOUND");

    const uploaded = [];
    try {
      for (const file of request.files) uploaded.push(await uploadProjectImage(file, project.id));
      const images = await Promise.all(uploaded.map((image) => prisma.projectImage.create({
        data: { projectId: project.id, imageUrl: image.imageUrl, publicId: image.publicId, imageType: body.data.imageType },
        select: safeImageSelect,
      })));
      return response.status(201).json({ data: images });
    } catch (error) {
      await Promise.allSettled(uploaded.map((image) => deleteProjectImage(image.publicId)));
      throw error;
    }
  } catch (error) { return next(error); }
}

export async function deleteAdminProjectImage(request, response, next) {
  try {
    const params = deleteProjectImageParamsSchema.safeParse(request.params);
    if (!params.success) throw new AppError("Image not found.", 404, "NOT_FOUND");
    const image = await prisma.projectImage.findFirst({
      where: { id: params.data.imageId, projectId: params.data.projectId },
      select: { id: true, publicId: true },
    });
    if (!image) throw new AppError("Image not found.", 404, "NOT_FOUND");
    if (!image.publicId) throw new AppError("This legacy image cannot be removed until it is migrated to managed storage.", 409, "IMAGE_NOT_MANAGED");

    await deleteProjectImage(image.publicId);
    await prisma.projectImage.delete({ where: { id: image.id } });
    return response.status(204).send();
  } catch (error) { return next(error); }
}