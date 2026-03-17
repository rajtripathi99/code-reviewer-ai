export const ok          = (res, data)          => res.status(200).json({ success: true, data });
export const created     = (res, data)          => res.status(201).json({ success: true, data });
export const badRequest  = (res, msg, details)  => res.status(400).json({ success: false, error: { code: "BAD_REQUEST",    message: msg, details } });
export const unauthorized= (res, msg)           => res.status(401).json({ success: false, error: { code: "UNAUTHORIZED",   message: msg || "Unauthorized" } });
export const forbidden   = (res, msg)           => res.status(403).json({ success: false, error: { code: "FORBIDDEN",      message: msg || "Forbidden" } });
export const notFound    = (res, msg)           => res.status(404).json({ success: false, error: { code: "NOT_FOUND",      message: msg || "Not found" } });
export const serverError = (res, msg)           => res.status(500).json({ success: false, error: { code: "SERVER_ERROR",   message: msg || "Something went wrong" } });
