import { path } from "@/constants/routes.const";
import { Route, Routes } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

import { Suspense } from "react";
import Index from "@/components/navbar/Index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  About,
  Home,
  Movies,
  MovieDetail,
  Drama,
  More,
  Fiction,
  LogIn,
  SignUp,
  NotFound,
} from "@/pages/lazyPages";
export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center p-10">
          <ScaleLoader />
        </div>
      }
    >
      <Routes>
        <Route element={<Index />}>
          {/* //*Further Pages */}
          <Route path={path.home} element={<Home />} />
          <Route path={path.about} element={<About />} />
          <Route path={path.movies} element={<Movies />} />
          <Route path={`${path.movies}/:id`} element={<MovieDetail />} />
          {/* //* Auth */}
          <Route path={path.logIn} element={<LogIn />} />
          <Route path={path.signUp} element={<SignUp />} />
          {/* pages */}
          <Route path={path.drama} element={<Drama />} />
          <Route path={path.fiction} element={<Fiction />} />
          <Route path={path.search} element={<More />} />
        </Route>
        {/*//* Not Found Page  */}
        <Route path={path.notFound} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
