import React from "react";

const MovieBackdrop = ({ backdrop_path }) => {
  return (
    <div
      className="relative w-full h-[40vh] sm:h-[50vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
};

export default MovieBackdrop;
