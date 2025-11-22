import { lazy } from "react";

export { default as Home } from "@/pages/Home.index";
export const About = lazy(() => import("@/pages/About.index"));
export const Movies = lazy(() => import("@/pages/Movies.index"));
export const MovieDetail = lazy(() => import("@/pages/MovieDetail.index"));
export const Drama = lazy(() => import("@/pages/Drama.index"));
export const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
export const DashboardUsers = lazy(() => import("@/pages/Admin/DashboardUsers"));
export const DashboardAdminRequests = lazy(() => import("@/pages/Admin/DashboardAdminRequests"));
export const DashboardAdRequests = lazy(() => import("@/pages/Admin/DashboardAdRequests"));
export const Fiction = lazy(() => import("@/pages/Fiction.index"));
export const More = lazy(() => import("@/pages/More"));
export const Profile = lazy(() => import("@/pages/Profile.index"));
export const ChangeName = lazy(() => import("@/pages/ChangeName.index"));
export const ChangePassword = lazy(() => import("@/pages/ChangePassword.index"));
export const AdRequest = lazy(() => import("@/pages/AdRequest.index"));
export const Favourites = lazy(() => import("@/pages/Favourites.index"));
// Auth
export const LogIn = lazy(() => import("@/pages/auth/LogIn"));
export const SignUp = lazy(() => import("@/pages/auth/SignUp"));
export const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
export const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
export const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
//404
export const NotFound = lazy(() => import("@/pages/err/NotFound.index"));
