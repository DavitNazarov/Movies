import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Heart } from "lucide-react";
import MovieCard from "@/components/movies/MovieCard.index";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import { path } from "@/constants/routes.const";
import { toast } from "react-toastify";

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

const Portfolio = () => {
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

  const emptyContent = useMemo(() => {
    if (!isAuthed) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-rose-300 bg-rose-50/60 px-6 py-16 text-center text-rose-700">
          <Heart className="size-10" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Please register to add favourite movies
            </h2>
            <p className="text-sm text-rose-600">
              Create an account or sign in to start saving your favourite
              titles.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              <Link to={path.signUp}>Register</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Link to={path.logIn}>Log in</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-rose-600">
          {error}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center text-zinc-600 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-800">
          No favourite movies yet
        </h2>
        <p className="mt-2 text-sm">
          Browse movies and tap the heart icon to keep them here.
        </p>
      </div>
    );
  }, [isAuthed, loading, error]);

  return (
    <div className="px-4 py-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-black">Your Favourites</h1>
          <p className="text-sm text-zinc-600">
            All movies you have saved live under Portfolio.
          </p>
        </div>
        {isAuthed && (
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-700">
            <Heart className="size-4" />
            {favouriteCount} saved
          </span>
        )}
      </header>

      {favouriteCount === 0 ? (
        emptyContent
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {favorites.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3.5 shadow-sm transition hover:shadow-md"
              >
                <MovieCard m={movie} onSelect={handleSelect} size="sm" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-black sm:text-lg">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-500 sm:text-sm">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "Unknown year"}
                    </p>
                  </div>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(movie.movieId)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
