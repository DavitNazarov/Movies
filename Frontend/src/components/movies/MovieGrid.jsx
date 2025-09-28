import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "./MovieCard.index";

export default function MovieGrid({ movies, loading, page, onSelect }) {
  if (loading) {
    return (
      <motion.div
        key="skeletons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 "
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
          />
        ))}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`page-${page}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 cursor-pointer"
      >
        {movies.map((m) => (
          <MovieCard key={m.id} m={m} onSelect={onSelect} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
