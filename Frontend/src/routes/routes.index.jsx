import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import { path } from "@/constants/routes.const";
import Index from "@/components/navbar/Index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  About,
  Home,
  Movies,
  MovieDetail,
  Drama,
  Dashboard,
  DashboardUsers,
  DashboardAdminRequests,
  DashboardAdRequests,
  More,
  Fiction,
  LogIn,
  SignUp,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  NotFound,
  Profile,
  ChangeName,
  ChangePassword,
  AdRequest,
  Favourites,
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
          <Route path={path.verifyEmail} element={<VerifyEmail />} />
          <Route path={path.forgotPassword} element={<ForgotPassword />} />
          <Route path={`${path.resetPassword}/:token`} element={<ResetPassword />} />
          <Route
            path={path.profile}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={path.changeName}
            element={
              <ProtectedRoute>
                <ChangeName />
              </ProtectedRoute>
            }
          />
          <Route
            path={path.changePassword}
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={path.adRequest}
            element={
              <ProtectedRoute>
                <AdRequest />
              </ProtectedRoute>
            }
          />
          {/* pages */}
          <Route path={path.drama} element={<Drama />} />
          <Route path={path.fiction} element={<Fiction />} />
          <Route path={path.search} element={<More />} />
          <Route path={path.favourites} element={<Favourites />} />
          {/* Admin */}
          <Route
            path={path.admin}
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path={path.dashboardUsers}
            element={
              <AdminRoute>
                <DashboardUsers />
              </AdminRoute>
            }
          />
          <Route
            path={path.dashboardAdminRequests}
            element={
              <AdminRoute>
                <DashboardAdminRequests />
              </AdminRoute>
            }
          />
          <Route
            path={path.dashboardAdRequests}
            element={
              <AdminRoute>
                <DashboardAdRequests />
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
