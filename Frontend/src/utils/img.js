export const IMG = (path, size = 500) =>
  path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${size}${path}` : "";
