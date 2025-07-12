import { path } from "@/constants/routes.const";
import MainLayout from "@/layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { Home, About, Movies, NotFound } from "@/pages/Pages.index";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={path.home} element={<Home />} />
        <Route path={path.about} element={<About />} />
        <Route path={path.movies} element={<Movies />} />
        <Route path={path.notFound} element={<NotFound />} />
      </Route>
    </Routes>
  );
};
