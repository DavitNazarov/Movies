import { path } from "@/constants/routes.const";
import { House, Clapperboard, Users, LogIn, IdCard } from "lucide-react";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  DropDown: [
    {
      title: "All Genres",
      url: path.movies,
      icon: Clapperboard,
      items: [
        {
          title: "Movies",
          url: path.movies,
        },
        {
          title: "Drama",
          url: path.movieDetail,
        },
        {
          title: "Fiction",
          url: "#",
        },
        {
          title: "More",
          url: "#",
        },
      ],
    },
  ],
  mainLinks: [
    {
      name: "Home",
      url: path.home,
      icon: House,
    },
    {
      name: "About",
      url: path.about,
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Log In",
      url: path.logIn,
      icon: LogIn,
    },
    {
      title: "Register",
      url: path.signUp,
      icon: IdCard,
    },
  ],
};
