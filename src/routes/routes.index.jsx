import { path } from "@/constants/routes.const";
import MainLayout from "@/layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  About,
  Movies,
  NotFound,
  LogIn,
  SignUp,
} from "@/pages/Pages.index";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* //*Further Pages */}
        <Route path={path.home} element={<Home />} />
        <Route path={path.about} element={<About />} />
        <Route path={path.movies} element={<Movies />} />
        {/* //* Auth */}
        <Route path={path.logIn} element={<LogIn />} />
        <Route path={path.signUp} element={<SignUp />} />
        {/*//* Not Found Page  */}
        <Route path={path.notFound} element={<NotFound />} />
      </Route>
    </Routes>
  );
};
