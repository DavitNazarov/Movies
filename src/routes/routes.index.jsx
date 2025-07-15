import { path } from "@/constants/routes.const";
import MainLayout from "@/layouts/MainLayout";
import { Route, Routes } from "react-router-dom";

import {
  About,
  Home,
  LogIn,
  Movies,
  NotFound,
  SignUp,
} from "@/pages/lazyPages";
import { Suspense } from "react";

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
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
    </Suspense>
  );
};
