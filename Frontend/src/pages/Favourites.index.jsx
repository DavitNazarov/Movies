import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import { path } from "@/constants/routes.const";
import { toast } from "react-toastify";
import { FavouritesEmptyState } from "@/components/favourites/FavouritesEmptyState";
import { FavouritesHeader } from "@/components/favourites/FavouritesHeader";
import { FavouritesGrid } from "@/components/favourites/FavouritesGrid";

const normalizeFavorites = (items = []) =>
  items.map((fav) => ({
    id: fav.movieId,
    movieId: fav.movieId,
    title: fav.title || "Untitled",
    poster_path: fav.posterPath || fav.poster_path || "",
    backdrop_path: fav.backdropPath || fav.backdrop_path || "",
    release_date: fav.releaseDate || "",
    vote_average:
      typeof fav.voteAverage === "number"
        ? fav.voteAverage
        : typeof fav.vote_average === "number"
          ? fav.vote_average
          : null,
  }));

const Favourites = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isAuthed = Boolean(user?._id || user?.id);
  const [favorites, setFavorites] = useState(() =>
    normalizeFavorites(user?.favoriteMovies)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const favouriteCount = favorites.length;

  useEffect(() => {
    setFavorites(normalizeFavorites(user?.favoriteMovies));
  }, [user?.favoriteMovies]);

  useEffect(() => {
    if (!isAuthed) {
      setFavorites([]);
      return;
    }

    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/users/me/favorites");
        if (!active) return;
        setFavorites(normalizeFavorites(data.favorites ?? []));
      } catch (err) {
        if (!active) return;
        const msg = getErr(err);
        setError(msg);
        toast.error(msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthed]);

  const handleRemove = useCallback(
    async (movieId) => {
      if (!movieId) return;
      try {
        await api.delete(`/api/users/me/favorites/${movieId}`);
        const updated = favorites.filter((item) => item.movieId !== movieId);
        setFavorites(updated);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                favoriteMovies: (prev.favoriteMovies || []).filter(
                  (fav) => fav.movieId !== movieId
                ),
              }
            : prev
        );
        toast.success("Removed from favourites");
      } catch (err) {
        toast.error(getErr(err));
      }
    },
    [favorites, setUser]
  );

  const handleSelect = useCallback(
    (movieId) => {
      if (!movieId) return;
      navigate(`${path.movies}/${movieId}`);
    },
    [navigate]
  );

  return (
    <div className="px-4 py-8 sm:px-8">
      <FavouritesHeader favouriteCount={favouriteCount} isAuthed={isAuthed} />

      {favouriteCount === 0 ? (
        <FavouritesEmptyState
          isAuthed={isAuthed}
          loading={loading}
          error={error}
        />
      ) : (
        <FavouritesGrid
          favorites={favorites}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default Favourites;
