import { path } from "@/constants/routes.const";
import { House, Clapperboard, Users, LogIn, IdCard, Heart } from "lucide-react";

export function buildNavData(user) {
  const userId = user?._id || user?.id;
  const isAuthed = Boolean(userId);
  const favoriteCount = Array.isArray(user?.favoriteMovies)
    ? user.favoriteMovies.length
    : 0;

  return {
    user: isAuthed
      ? {
          name: user.name || user.username || "User",
          email: user.email ?? "",
          avatar: user.imageUrl ?? "/avatars/default.jpg",
        }
      : null,

    DropDown: [
      {
        title: "All Genres",
        url: path.movies,
        icon: Clapperboard,
        items: [
          { title: "Movies", url: path.movies },
          { title: "Drama", url: path.drama },
          { title: "Fiction", url: path.fiction },
          { title: "More", url: path.search },
        ],
      },
    ],

    mainLinks: [
      { name: "Home", url: path.home, icon: House },
      { name: "About", url: path.about, icon: Users },
      {
        name: "Favourites",
        url: path.portfolio,
        icon: Heart,
        badge: favoriteCount,
      },
    ],

    // hide auth buttons when logged in
    authBtn: isAuthed
      ? []
      : [
          { title: "Log In", url: path.logIn, icon: LogIn },
          { title: "Register", url: path.signUp, icon: IdCard },
        ],
  };
}
