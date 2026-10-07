import { prisma } from "../lib/prisma.js";

export async function listMaterials(_request, response, next) {
  try {
    const materials = await prisma.material.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        warrantyYears: true,
        description: true,
      },
    });

    response.json({ data: materials });
  } catch (error) {
    next(error);
  }
}
