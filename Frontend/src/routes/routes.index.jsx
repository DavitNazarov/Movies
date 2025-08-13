import { path } from "@/constants/routes.const";
import { Route, Routes } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

import {
  About,
  Home,
  Movies,
  LogIn,
  SignUp,
  NotFound,
} from "@/pages/lazyPages";
import { Suspense } from "react";
import Index from "@/components/navbar/Index";

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
