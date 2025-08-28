// returns a compact window of page numbers
export function getWindowPages(page, totalPages, span = 5) {
  const half = Math.floor(span / 2);
  const start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + span - 1);
  const fixedStart = Math.max(1, end - span + 1);
  return Array.from({ length: end - fixedStart + 1 }, (_, i) => fixedStart + i);
}
