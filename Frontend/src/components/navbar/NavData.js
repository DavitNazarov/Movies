import { path } from "@/constants/routes.const";
import { House, Clapperboard, Users, LogIn, IdCard } from "lucide-react";

export function buildNavData(user) {
  const isAuthed = !!user;

  return {
    user: isAuthed
      ? {
          name: user.name ?? "User",
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
          { title: "Drama", url: path.movieDetail },
          { title: "Fiction", url: "#" },
          { title: "More", url: "#" },
        ],
      },
    ],

    mainLinks: [
      { name: "Home", url: path.home, icon: House },
      { name: "About", url: path.about, icon: Users },
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
