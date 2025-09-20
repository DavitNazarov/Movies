import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovies, fetchDramaMovies, fetchFictionMovies } from "@/api/tmdb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();

  const [popular, setPopular] = useState([]);
  const [drama, setDrama] = useState([]);
  const [fiction, setFiction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const [popData, dramaData, fictionData] = await Promise.all([
        fetchMovies(),
        fetchDramaMovies(),
        fetchFictionMovies(),
      ]);
      setPopular(popData.results);
      setDrama(dramaData.results);
      setFiction(fictionData.results);
      setLoading(false);
    }

    loadMovies();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-black">
        Loading...
      </div>
    );

  const movieCard = (movie) => (
    <motion.div
      key={movie.id}
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

  const renderMovieRow = (title, movies) => (
    <motion.section
      className="mt-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900">
        {title}
      </h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-2xl snap-x snap-mandatory overflow-x-auto">
        <div className="flex space-x-4 sm:space-x-6 p-2 sm:p-4">
          {movies.map(movieCard)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.section>
  );

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.section
        className="mt-10 text-center bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 py-8 rounded-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          Welcome {user ? user.name : ""}, to MovieDB
        </h1>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg">
          Discover popular movies, dramas, and fiction films at your fingertips!
        </p>
      </motion.section>

      {/* Movie Rows */}
      {renderMovieRow("Popular Movies", popular)}
      {renderMovieRow("Drama Movies", drama)}
      {renderMovieRow("Fiction Movies", fiction)}
    </div>
  );
};

export default Home;
