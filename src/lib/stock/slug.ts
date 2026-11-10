/** Lowercase ASCII slug: accents stripped, any other run of symbols becomes one hyphen. */
export function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "auto";
}

/** Id reduced to url-safe characters, lowercased. */
export function idToken(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Stable vehicle slug: slugified name plus the first six url-safe characters of the id,
 * so two vehicles with the same name still get different pages.
 */
export function vehicleSlug(name: string, id: string, idLength = 6): string {
  const token = idToken(id).slice(0, idLength);
  const base = slugify(name);
  return token.length > 0 ? `${base}-${token}` : base;
}
