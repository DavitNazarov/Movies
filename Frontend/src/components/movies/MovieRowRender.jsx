import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MovieCard from "@/components/movies/MovieCard.slider";
const MovieRowRender = ({ title, movies }) => {
  return (
    <section className="mt-6 sm:mt-10">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-5 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-zinc-900/40 shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 sm:space-x-5 md:space-x-6 p-3 sm:p-4">
            {movies?.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[150px] sm:min-w-[180px] md:min-w-[220px] flex-shrink-0"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};
export default MovieRowRender;
