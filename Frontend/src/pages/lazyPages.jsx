import { lazy } from "react";

export { default as Home } from "@/pages/Home.index";
export const About = lazy(() => import("@/pages/About.index"));
export const Movies = lazy(() => import("@/pages/Movies.index"));
export const Drama = lazy(() => import("@/pages/Drama.index"));
// Auth
export const LogIn = lazy(() => import("@/pages/auth/LogIn"));
export const SignUp = lazy(() => import("@/pages/auth/SignUp"));
//404
export const NotFound = lazy(() => import("@/pages/err/NotFound.index"));
