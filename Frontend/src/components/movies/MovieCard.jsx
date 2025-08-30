import { motion } from "framer-motion";
import { IMG } from "@/utils/img";

export default function MovieCard({ m }) {
  const imgSrc = m.poster_path
    ? IMG(m.poster_path)
    : m.backdrop_path
    ? IMG(m.backdrop_path)
    : null;

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative">
        {imgSrc && (
          <img
            src={imgSrc}
            alt={m.title || "No poster"}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 text-sm font-medium cursor-text">
          {m.title}
        </h2>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="cursor-text">
            {m.release_date?.slice(0, 4) || "—"}
          </span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800 cursor-text">
            ★ {m.vote_average?.toFixed(1) ?? "—"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
