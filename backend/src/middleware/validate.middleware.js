import { badRequest } from "../utils/response.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return badRequest(res, "Validation failed", result.error.flatten().fieldErrors);
    }
    req.body = result.data;
    next();
  };
}
