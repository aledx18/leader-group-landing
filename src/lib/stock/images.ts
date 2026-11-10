import { getImage } from "astro:assets";
import { resolvePhoto } from "./photos";

interface OptimizeOptions {
  width: number;
  height?: number;
  format?: "jpg" | "webp";
}

/**
 * Optimized, build-time copy of a contract photo (remote photos are downloaded here).
 * Returns the root-relative path of the generated file plus its final dimensions.
 */
export async function optimizedPhoto(
  photo: string | undefined,
  { width, height, format = "webp" }: OptimizeOptions,
): Promise<{ src: string; width: number; height: number }> {
  const source = resolvePhoto(photo);
  const sizing = height ? { width, height, fit: "cover" as const } : { width };
  const image =
    typeof source === "string"
      ? await getImage({ src: source, inferSize: true, format, ...sizing })
      : await getImage({ src: source, format, ...sizing });
  return {
    src: image.src,
    width: Number(image.attributes.width ?? width),
    height: Number(image.attributes.height ?? height ?? 0),
  };
}
