import { AppError } from "../utils/appError.js";

export function notFound(_request, _response, next) {
  next(new AppError("Route not found.", 404, "NOT_FOUND"));
}
