import { notifyNewQuote } from "../lib/email.js";
import { prisma } from "../lib/prisma.js";
import { verifyTurnstileToken } from "../lib/turnstile.js";
import { quoteCreateSchema } from "../schemas/quote.schema.js";
import { AppError } from "../utils/appError.js";

const serviceSelect = { id: true, name: true };

export async function createQuote(request, response, next) {
  const parsed = quoteCreateSchema.safeParse(request.body);

  if (!parsed.success) {
    return next(new AppError(
      "Quote details are invalid.",
      422,
      "VALIDATION_ERROR",
      parsed.error.flatten(),
    ));
  }

  try {
    const { serviceIds, turnstileToken, ...input } = parsed.data;
    await verifyTurnstileToken(turnstileToken);

    const selectedServiceCount = await prisma.service.count({
      where: { id: { in: serviceIds }, active: true },
    });
    if (selectedServiceCount !== serviceIds.length) {
      throw new AppError("One or more selected services are unavailable.", 422, "VALIDATION_ERROR", { fieldErrors: { serviceIds: ["Choose available services."] }, formErrors: [] });
    }

    const quote = await prisma.quote.create({
      data: {
        ...input,
        installationType: input.installationType || "UNSURE",
        quoteServices: {
          create: serviceIds.map((serviceId) => ({ service: { connect: { id: serviceId } } })),
        },
      },
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        carModel: true,
        yearModel: true,
        installationType: true,
        preferredDate: true,
        notes: true,
        status: true,
        createdAt: true,
        quoteServices: { select: { service: { select: serviceSelect } } },
        material: { select: { id: true, name: true, type: true, warrantyYears: true } },
      },
    });

    const services = quote.quoteServices.map(({ service }) => service);
    void notifyNewQuote({ ...quote, services, material: quote.material });

    return response.status(201).json({
      data: { id: quote.id, status: quote.status, createdAt: quote.createdAt },
    });
  } catch (error) {
    return next(error);
  }
}