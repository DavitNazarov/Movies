import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MovieCard = ({ movie }) => (
  <motion.div
    className="w-[140px] sm:w-[160px] shrink-0 cursor-pointer"
    whileHover={{ scale: 1.05, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link to={`/movies/${movie.id}`}>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-lg"
      />
      <p className="text-xs sm:text-sm font-medium line-clamp-2 mt-2 text-gray-800">
        {movie.title}
      </p>
    </Link>
  </motion.div>
);

export default MovieCard;
