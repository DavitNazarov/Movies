import { Heart } from "lucide-react";

export function FavouritesHeader({ favouriteCount, isAuthed }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold text-black">Your Favourites</h1>
        <p className="text-sm text-zinc-600">
          All movies you have saved in your favourites collection.
        </p>
      </div>
      {isAuthed && (
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-700">
          <Heart className="size-4" />
          {favouriteCount} saved
        </span>
      )}
    </header>
  );
}

