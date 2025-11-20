import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { path } from "@/constants/routes.const";

export function FavouritesEmptyState({ isAuthed, loading, error }) {
  if (!isAuthed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-rose-300 bg-rose-50/60 px-6 py-16 text-center text-rose-700">
        <Heart className="size-10" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Please register to add favourite movies
          </h2>
          <p className="text-sm text-rose-600">
            Create an account or sign in to start saving your favourite titles.
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
}

