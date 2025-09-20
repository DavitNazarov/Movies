import { motion } from "framer-motion";

const MovieContent = ({
  poster_path,
  title,
  tagline,
  genres,
  release_date,
  runtime,
  vote_average,
  vote_count,
  overview,
  production_companies,
  production_countries,
  budget,
  revenue,
  status,
  popularity,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {/* Poster */}
      <motion.img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={title}
        className="rounded-2xl shadow-lg  max-h-[450px] md:max-h-[500px] object-cover"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      {/* Info */}
      <motion.div
        className="md:col-span-2"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{title}</h1>
        {tagline && <p className="italic text-gray-600 mb-4">“{tagline}”</p>}

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          {genres?.map((g) => (
            <span
              key={g.id}
              className="px-3 py-1 bg-black text-white rounded-full text-xs sm:text-sm"
            >
              {g.name}
            </span>
          ))}
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-2">
          🗓 {release_date || "Unknown"} | ⏱ {runtime} min
        </p>
        <p className="text-gray-700 text-sm sm:text-base mb-2">
          ⭐ {vote_average?.toFixed(1)} / 10 ({vote_count} votes)
        </p>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
          {overview}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-black mb-1">
              Production Companies
            </h3>
            <ul className="space-y-1">
              {production_companies?.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">
              Production Countries
            </h3>
            <ul className="space-y-1">
              {production_countries?.map((c) => (
                <li key={c.iso_3166_1}>{c.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">Budget</h3>
            <p>
              {budget && budget > 0 ? `$${budget.toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">Revenue</h3>
            <p>
              {revenue && revenue > 0 ? `$${revenue.toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">Status</h3>
            <p>{status}</p>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">Popularity</h3>
            <p>{Math.round(popularity)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieContent;
