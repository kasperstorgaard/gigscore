export function getSlug(name = "") {
  return name.replace(/[^a-z\d]/gi, "-").toLowerCase();
}

export function getLanguage(req: Request) {
  const headerValue = req.headers.get("accept-language");

  return (headerValue ?? "").split(",")[0];
}
