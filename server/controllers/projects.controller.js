import { prisma } from "../lib/prisma.js";

const publicImageSelect = { id: true, imageUrl: true, imageType: true, createdAt: true };
const publicMaterialSelect = { id: true, name: true, type: true, warrantyYears: true };

export async function listProjects(_request, response, next) {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        carModel: true,
        yearModel: true,
        description: true,
        createdAt: true,
        material: { select: publicMaterialSelect },
        images: { select: publicImageSelect },
      },
    });

    const data = projects.map(({ images, ...project }) => ({
      ...project,
      projectImages: images,
    }));

    return response.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}