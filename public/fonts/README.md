# Fonts

Self-hosted `.woff2` files used by `src/styles/fonts.css`.

| File                      | Family                 | Use                       | Source                       |
| ------------------------- | ---------------------- | ------------------------- | ---------------------------- |
| `archivo-latin-800.woff2` | Archivo 800            | headings (`font-display`) | `@fontsource/archivo`        |
| `archivo-latin-900.woff2` | Archivo 900            | headings (`font-display`) | `@fontsource/archivo`        |
| `inter-latin.woff2`       | Inter variable 100-900 | body (`font-sans`)        | `@fontsource-variable/inter` |

## How to add or replace a font

1. Pick a family on [fontsource.org](https://fontsource.org/).
2. Download the **latin** `.woff2` (for example `bunx` the package and copy from `files/`).
3. Drop the file here and add a matching `@font-face` in `src/styles/fonts.css`.
4. Point `--font-sans` / `--font-display` in the `@theme` block there.

Both families are licensed under the SIL Open Font License 1.1.
