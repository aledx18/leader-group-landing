import type { ImageMetadata } from "astro";
import placeholder from "@/assets/brand/vehicle-placeholder.png";
import { FIXTURE_PHOTO_PREFIX } from "./types";

const fixtureFiles = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/fixture/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const fixtureByName = new Map(
  Object.entries(fixtureFiles).map(([path, mod]) => [
    path.replace(/^.*\//, "").replace(/\.[^.]+$/, ""),
    mod.default,
  ]),
);

/** A source `astro:assets` can render: a local asset, or a remote URL to download at build. */
export type PhotoSource = ImageMetadata | string;

/** Resolves a contract photo reference; unknown fixture names fall back to the placeholder. */
export function resolvePhoto(photo: string | undefined): PhotoSource {
  if (photo === undefined) return placeholder;
  if (photo.startsWith(FIXTURE_PHOTO_PREFIX)) {
    return fixtureByName.get(photo.slice(FIXTURE_PHOTO_PREFIX.length)) ?? placeholder;
  }
  return photo;
}

export { placeholder as vehiclePlaceholder };
