import { motion } from "framer-motion";
import { IMG } from "@/utils/img";

export default function MovieCard({ m, onSelect, size = "md" }) {
  const imgSrc = m.poster_path
    ? IMG(m.poster_path)
    : m.backdrop_path
      ? IMG(m.backdrop_path)
      : null;

  const sizes = {
    sm: {
      container: "rounded-xl max-h-[320px] cursor-pointer",
      imageWrapper: "rounded-[0.9rem] overflow-hidden",
      image: "h-[220px]",
      padding: "p-2.5",
      title: "text-xs font-semibold",
      meta: "mt-1.5 text-[11px]",
      badge: "px-1 py-0.5 text-[10px]",
    },
    md: {
      container: "rounded-2xl",
      imageWrapper: "rounded-2xl overflow-hidden",
      image: "aspect-[2/3]",
      padding: "p-3",
      title: "text-sm font-medium",
      meta: "mt-2 text-xs",
      badge: "px-1.5 py-0.5 text-[11px]",
    },
  };

  const variant = sizes[size] ?? sizes.md;
  const imageBase =
    "w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]";

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={`group overflow-hidden border border-zinc-200 bg-white shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900 ${variant.container}`}
      onClick={() => {
        console.log("Selected movie ID:", m.id);
        onSelect(m.id);
      }}
    >
      <div className={`relative bg-zinc-100 ${variant.imageWrapper}`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={m.title || "No poster"}
            loading="lazy"
            className={`${imageBase} ${variant.image}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-xs text-zinc-500">
            No image
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className={variant.padding}>
        <h2 className={`line-clamp-2 cursor-text ${variant.title}`}>
          {m.title}
        </h2>
        <div
          className={`flex items-center justify-between text-zinc-500 dark:text-zinc-400 ${variant.meta}`}
        >
          <span className="cursor-text">
            {m.release_date?.slice(0, 4) || "—"}
          </span>
          <span
            className={`rounded-md bg-zinc-100 dark:bg-zinc-800 cursor-text ${variant.badge}`}
          >
            ★ {m.vote_average?.toFixed(1) ?? "—"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
