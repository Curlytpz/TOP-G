import { prisma } from "../lib/prisma.js";
import { deleteProjectImage } from "../lib/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { createProjectSchema, projectIdSchema, publishProjectSchema, updateProjectSchema } from "../schemas/project.schema.js";

const projectInclude = {
  images: { select: { id: true, imageUrl: true, publicId: true, imageType: true, createdAt: true } },
  material: { select: { id: true, name: true, type: true, warrantyYears: true } },
};

function serializeProject({ images, ...project }) {
  return { ...project, projectImages: images };
}

function validationError() {
  return new AppError("Please check the project details and try again.", 422, "VALIDATION_ERROR");
}

async function ensureMaterial(materialId) {
  if (!materialId) return;
  const material = await prisma.material.findUnique({ where: { id: materialId }, select: { id: true } });
  if (!material) throw validationError();
}

export async function listAdminProjects(_request, response, next) {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: projectInclude });
    return response.json({ data: projects.map(serializeProject) });
  } catch (error) { return next(error); }
}

export async function getAdminProject(request, response, next) {
  try {
    const parsed = projectIdSchema.safeParse(request.params);
    if (!parsed.success) throw new AppError("Project not found.", 404, "NOT_FOUND");
    const project = await prisma.project.findUnique({ where: { id: parsed.data.id }, include: projectInclude });
    if (!project) throw new AppError("Project not found.", 404, "NOT_FOUND");
    return response.json({ data: serializeProject(project) });
  } catch (error) { return next(error); }
}

export async function createAdminProject(request, response, next) {
  try {
    const parsed = createProjectSchema.safeParse(request.body);
    if (!parsed.success) throw validationError();
    await ensureMaterial(parsed.data.materialId);
    const project = await prisma.project.create({ data: { ...parsed.data, published: parsed.data.published ?? false }, include: projectInclude });
    return response.status(201).json({ data: serializeProject(project) });
  } catch (error) { return next(error); }
}

export async function updateAdminProject(request, response, next) {
  try {
    const id = projectIdSchema.safeParse(request.params);
    const body = updateProjectSchema.safeParse(request.body);
    if (!id.success || !body.success) throw validationError();
    await ensureMaterial(body.data.materialId);
    const project = await prisma.project.update({ where: { id: id.data.id }, data: body.data, include: projectInclude });
    return response.json({ data: serializeProject(project) });
  } catch (error) {
    if (error?.code === "P2025") return next(new AppError("Project not found.", 404, "NOT_FOUND"));
    return next(error);
  }
}

export async function setAdminProjectPublished(request, response, next) {
  try {
    const id = projectIdSchema.safeParse(request.params);
    const body = publishProjectSchema.safeParse(request.body);
    if (!id.success || !body.success) throw validationError();
    const project = await prisma.project.update({ where: { id: id.data.id }, data: { published: body.data.published }, include: projectInclude });
    return response.json({ data: serializeProject(project) });
  } catch (error) {
    if (error?.code === "P2025") return next(new AppError("Project not found.", 404, "NOT_FOUND"));
    return next(error);
  }
}

export async function deleteAdminProject(request, response, next) {
  try {
    const parsed = projectIdSchema.safeParse(request.params);
    if (!parsed.success) throw new AppError("Project not found.", 404, "NOT_FOUND");

    const project = await prisma.project.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, images: { select: { id: true, publicId: true } } },
    });
    if (!project) throw new AppError("Project not found.", 404, "NOT_FOUND");

    try {
      await Promise.all(project.images.filter((image) => image.publicId).map((image) => deleteProjectImage(image.publicId)));
    } catch (error) {
      console.error("[projects] Cloudinary project image cleanup failed.", {
        projectId: project.id,
        imageCount: project.images.length,
        code: error?.code || "UNKNOWN",
      });
      throw new AppError("We couldn't remove this project and its images. Please try again.", 502, "PROJECT_DELETE_FAILED");
    }

    await prisma.$transaction([
      prisma.projectImage.deleteMany({ where: { projectId: project.id } }),
      prisma.project.delete({ where: { id: project.id } }),
    ]);

    return response.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") return next(new AppError("Project not found.", 404, "NOT_FOUND"));
    return next(error);
  }
}
