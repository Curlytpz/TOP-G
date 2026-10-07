import { prisma } from "../lib/prisma.js";
import { quoteIdSchema, quoteStatusSchema } from "../schemas/adminQuote.schema.js";
import { AppError } from "../utils/appError.js";

const serviceSelect = { id: true, name: true };
const quoteInclude = {
  service: { select: serviceSelect },
  quoteServices: { select: { service: { select: serviceSelect } } },
  material: { select: { id: true, name: true, type: true, warrantyYears: true } },
  images: { select: { id: true, imageUrl: true, createdAt: true } },
};

function serializeQuote({ quoteServices, service, ...quote }) {
  const services = quoteServices.map(({ service: selectedService }) => selectedService);
  return { ...quote, service, services: services.length ? services : (service ? [service] : []) };
}

export async function listQuotes(_request, response, next) {
  try {
    const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" }, include: quoteInclude });
    return response.status(200).json({ data: quotes.map(serializeQuote) });
  } catch (error) {
    return next(error);
  }
}

export async function getQuote(request, response, next) {
  try {
    const parsed = quoteIdSchema.safeParse(request.params);
    if (!parsed.success) throw new AppError("Quote not found.", 404, "NOT_FOUND");

    const quote = await prisma.quote.findUnique({ where: { id: parsed.data.id }, include: quoteInclude });
    if (!quote) throw new AppError("Quote not found.", 404, "NOT_FOUND");
    return response.status(200).json({ data: serializeQuote(quote) });
  } catch (error) {
    return next(error);
  }
}

export async function updateQuoteStatus(request, response, next) {
  try {
    const parsedId = quoteIdSchema.safeParse(request.params);
    const parsedBody = quoteStatusSchema.safeParse(request.body);
    if (!parsedId.success || !parsedBody.success) {
      throw new AppError("Invalid quote status request.", 422, "VALIDATION_ERROR");
    }

    const quote = await prisma.quote.update({
      where: { id: parsedId.data.id },
      data: { status: parsedBody.data.status },
      include: quoteInclude,
    });
    return response.status(200).json({ data: serializeQuote(quote) });
  } catch (error) {
    if (error?.code === "P2025") return next(new AppError("Quote not found.", 404, "NOT_FOUND"));
    return next(error);
  }
}
export async function deleteQuote(request, response, next) {
  try {
    const parsed = quoteIdSchema.safeParse(request.params);
    if (!parsed.success) throw new AppError("Quote not found.", 404, "NOT_FOUND");

    const quote = await prisma.quote.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
    if (!quote) throw new AppError("Quote not found.", 404, "NOT_FOUND");

    await prisma.$transaction([
      prisma.quoteImage.deleteMany({ where: { quoteId: quote.id } }),
      prisma.quoteService.deleteMany({ where: { quoteId: quote.id } }),
      prisma.quote.delete({ where: { id: quote.id } }),
    ]);

    return response.status(200).json({ data: { id: quote.id, deleted: true } });
  } catch (error) {
    if (error?.code === "P2025") return next(new AppError("Quote not found.", 404, "NOT_FOUND"));
    return next(error);
  }
}