import { prisma } from "../lib/prisma.js";

export async function listTestimonials(_request, response, next) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { visible: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        review: true,
        rating: true,
        createdAt: true,
      },
    });

    response.json({ data: testimonials });
  } catch (error) {
    next(error);
  }
}
