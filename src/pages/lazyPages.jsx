import { lazy } from "react";

export const Home = lazy(() => import("@/pages/Home.index"));
export const About = lazy(() => import("@/pages/About.index"));
export const Movies = lazy(() => import("@/pages/Movies.index"));
export const LogIn = lazy(() => import("@/pages/auth/LogIn"));
export const SignUp = lazy(() => import("@/pages/auth/SignUp"));
export const NotFound = lazy(() => import("@/pages/err/NotFound.index"));
