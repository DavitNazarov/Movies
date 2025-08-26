import MoviesList from "@/components/movies/MoviesList.index";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="flex align-center justify-center h-screen">
      welcome {user ? user.name : ""}, to MovieDB
      <MoviesList />
    </div>
  );
};

export default Home;
