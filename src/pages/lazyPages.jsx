import { lazy } from "react";

export { default as Home } from "@/pages/Home.index";
export const About = lazy(() => import("@/pages/About.index"));
export const Movies = lazy(() => import("@/pages/Movies.index"));
export const Auth = lazy(() => import("@/pages/auth/Auth"));
export const NotFound = lazy(() => import("@/pages/err/NotFound.index"));
