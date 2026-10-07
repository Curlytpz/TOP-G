import { prisma } from "../lib/prisma.js";
import { projectIdSchema } from "../schemas/project.schema.js";

const publicImageSelect = { id: true, imageUrl: true, imageType: true, createdAt: true };
const publicMaterialSelect = { id: true, name: true, type: true, warrantyYears: true };

const publicProjectSelect = {
  id: true,
  title: true,
  carModel: true,
  yearModel: true,
  description: true,
  createdAt: true,
  material: { select: publicMaterialSelect },
  images: { select: publicImageSelect, orderBy: { createdAt: "asc" } },
};

function serializeProject({ images, ...project }) {
  return { ...project, projectImages: images };
}

export async function listProjects(_request, response, next) {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: publicProjectSelect,
    });

    return response.status(200).json({ data: projects.map(serializeProject) });
  } catch (error) {
    return next(error);
  }
}

export async function getProject(request, response, next) {
  const parsed = projectIdSchema.safeParse(request.params);
  if (!parsed.success) return response.status(404).json({ error: "Project not found." });

  try {
    const project = await prisma.project.findFirst({
      where: { id: parsed.data.id, published: true },
      select: publicProjectSelect,
    });

    if (!project) return response.status(404).json({ error: "Project not found." });

    return response.status(200).json({ data: serializeProject(project) });
  } catch (error) {
    return next(error);
  }
}
