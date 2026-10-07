import { prisma } from "../lib/prisma.js";

export async function listServices(_request, response, next) {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    response.json({ data: services });
  } catch (error) {
    next(error);
  }
}
