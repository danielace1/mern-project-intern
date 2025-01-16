import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import LoadingSpinner from "./components/LoadingSpinner";

import { API_URL } from "./api/api";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));

        console.log("token is here: ", token);

        if (!token) {
          return null;
        }

        if (data.message) return null;
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        console.log("authUser is here: ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* {authUser && <Sidebar />} */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        {/*} <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        /> */}
      </Routes>
      {/* {authUser && <RightPanel />} */}
      <Toaster />
    </div>
  );
};
export default App;
