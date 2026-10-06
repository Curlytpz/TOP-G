const imageModules = import.meta.glob("/src/assets/{services,materials}/**/*.{webp,jpg,jpeg,png}", { eager: true, query: "?url", import: "default" });
function numericFilename(path) { const filename = path.split("/").pop() ?? ""; const match = filename.match(/^(\d+)/); return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER; }
export function getGalleryImages(folder) {
  const prefix = `/src/assets/${folder.replace(/^\/+|\/+$/g, "")}/`;
  return Object.entries(imageModules).filter(([path]) => path.startsWith(prefix)).sort(([first], [second]) => numericFilename(first) - numericFilename(second) || first.localeCompare(second)).map(([, url]) => url);
}
export function getGallerySlots(folder, title, count = 3) {
  const images = getGalleryImages(folder).slice(0, count);
  return Array.from({ length: count }, (_, index) => ({ alt: `${title} sample ${index + 1}`, isPlaceholder: !images[index] && !images[0], src: images[index] ?? images[0] ?? null }));
}