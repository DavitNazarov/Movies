import React from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import MovieRowRender from "@/components/movies/MovieRowRender";
import { useMoviesSlider } from "@/hooks/useMovies";
import { MobileSearchInput } from "@/components/ui/MobileSearchInput";
import { AdBanner } from "@/components/ads/AdBanner";

const Home = () => {
  const { user } = useAuth();
  const { popular, fiction, drama, loading } = useMoviesSlider();

  if (loading) return <Loading />;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full px-3 py-6 sm:px-6 sm:py-10 xl:px-8"
    >
      <div className="mx-auto flex w-full max-w-screen-xl flex-col space-y-10">
        {/* Greeting Section */}
        <motion.section
          className="mt-2 sm:mt-4 lg:mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="movie-row__container">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-[#f6d6ff] via-[#ffe3f3] to-[#fff5d6] shadow-sm dark:border-zinc-800">
            <div className="absolute left-6 top-8 hidden h-20 w-32 rounded-full bg-white/30 blur-2xl sm:block" />
            <div className="absolute right-12 top-10 hidden h-24 w-36 rounded-full bg-white/25 blur-3xl lg:block" />
            <div className="relative flex flex-col gap-6 px-5 py-6 sm:px-7 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-10">
              <div className="flex-1 space-y-4 text-left">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700 shadow-sm">
                  Now showing
                </span>
                <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1] dark:text-zinc-100">
                  Welcome back{user ? `, ${user.name}` : ""} 👋
                </h1>
                <p className="text-sm text-zinc-700 sm:text-base md:text-lg lg:text-xl dark:text-zinc-200">
                  Discover the latest films, trending picks, and your all-time
                  favourites—each curated experience adapts perfectly across
                  every screen size.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-purple-700 shadow-sm">
                    <span className="size-2 rounded-full bg-purple-500" />
                    Fresh releases
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-rose-700 shadow-sm">
                    <span className="size-2 rounded-full bg-rose-500" />
                    Top rated
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
                    <span className="size-2 rounded-full bg-amber-500" />
                    Family picks
                  </div>
                </div>
              </div>

              <div className="hidden w-full max-w-xs overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-sm md:block lg:max-w-sm">
                <div className="flex h-full flex-col justify-between p-5">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Spotlight
                    </p>
                    <h3 className="text-2xl font-semibold leading-tight text-zinc-900">
                      Tonight’s Feature
                    </h3>
                    <p className="text-sm text-zinc-600">
                      Queue up a blockbuster or discover a hidden indie gem
                      curated just for you.
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-zinc-700">
                    <div className="flex items-center justify-between rounded-xl bg-white/85 px-3 py-2 shadow-sm">
                      <span>Trending now</span>
                      <span className="font-semibold text-purple-600">
                        8.9★
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/85 px-3 py-2 shadow-sm">
                      <span>Fan favourites</span>
                      <span className="font-semibold text-rose-500">12k+</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/85 px-3 py-2 shadow-sm">
                      <span>Watch later</span>
                      <span className="font-semibold text-amber-500">24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.section>

        {/* Mobile Search Input - shown only on mobile after welcome section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:hidden"
        >
          <MobileSearchInput />
        </motion.section>

        {/* Rows */}
        <MovieRowRender title="Popular Movies" movies={popular} />
        {/* Ad Banner Section - shown only under Popular Movies */}
        <AdBanner />
        <MovieRowRender title="Fiction Movies" movies={fiction} />
        <MovieRowRender title="Drama Movies" movies={drama} />
      </div>
    </motion.main>
  );
};

export default Home;
