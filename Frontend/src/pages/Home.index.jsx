// Home.jsx
import React from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import MovieRowRender from "@/components/movies/MovieRowRender";
import { useMoviesSlider } from "@/hooks/useMovies";

const Home = () => {
  const { user } = useAuth();
  const { popular, fiction, drama, loading } = useMoviesSlider();

  if (loading) return <Loading />;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10"
    >
      {/* Greeting Section */}
      <motion.section
        className="mt-4 sm:mt-6 lg:mt-10 px-2 sm:px-4 md:px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.section
          className="mt-4 sm:mt-6 lg:mt-10 px-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className=" w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 py-6 sm:py-8 md:py-10 rounded-2xl text-center shadow-md px-4">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-800 dark:text-zinc-100">
              Welcome back{user ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300">
              Discover the latest films, trending picks, and your all-time
              favorites—made for every screen size.
            </p>
          </div>
        </motion.section>
      </motion.section>

      {/* Rows */}
      <MovieRowRender title="Popular Movies" movies={popular} />
      <MovieRowRender title="Fiction Movies" movies={fiction} />
      <MovieRowRender title="Drama Movies" movies={drama} />
    </motion.main>
  );
};

export default Home;
