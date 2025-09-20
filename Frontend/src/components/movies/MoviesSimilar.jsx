import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const MoviesSimilar = ({ similarMovies }) => {
  return (
    <>
      {similarMovies?.length > 0 && (
        <motion.div
          className="mt-12 sm:mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Similar Movies</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-2xl border">
            <div className="flex space-x-4 sm:space-x-6 p-4">
              {similarMovies.map((m) => (
                <Link
                  to={`/movies/${m.id}`}
                  key={m.id}
                  className="w-[120px] sm:w-[160px] shrink-0"
                >
                  <motion.img
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.title}
                    className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-md mb-2"
                    whileHover={{ scale: 1.05 }}
                  />
                  <p className="text-xs sm:text-sm font-medium line-clamp-2">
                    {m.title}
                  </p>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.div>
      )}
    </>
  );
};

export default MoviesSimilar;
