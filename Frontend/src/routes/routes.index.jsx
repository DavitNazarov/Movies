import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import { path } from "@/constants/routes.const";
import Index from "@/components/navbar/Index";
// import ProtectedRoute from "@/components/auth/ProtectedRoute"; this function is not used currently due I'm being  lazy
import {
  About,
  Home,
  Movies,
  MovieDetail,
  Drama,
  Dashboard,
  More,
  Fiction,
  LogIn,
  SignUp,
  NotFound,
} from "@/pages/lazyPages";
import AdminRoute from "@/components/auth/AdminRoute";

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
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
          {/* Admin */}
          <Route
            path={path.admin}
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
        </Route>
        {/*//* Not Found Page  */}
        <Route path={path.notFound} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
