import { lazy } from "react";

export { default as Home } from "@/pages/Home.index";
export const About = lazy(() => import("@/pages/About.index"));
export const Movies = lazy(() => import("@/pages/Movies.index"));
export const MovieDetail = lazy(() => import("@/pages/MovieDetail.index"));
export const Drama = lazy(() => import("@/pages/Drama.index"));
export const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
export const Fiction = lazy(() => import("@/pages/Fiction.index"));
export const More = lazy(() => import("@/pages/More"));
// Auth
export const LogIn = lazy(() => import("@/pages/auth/LogIn"));
export const SignUp = lazy(() => import("@/pages/auth/SignUp"));
//404
export const NotFound = lazy(() => import("@/pages/err/NotFound.index"));
