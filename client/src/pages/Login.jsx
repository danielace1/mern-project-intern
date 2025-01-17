import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FaRegUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

import XSvg from "../components/X";
import { API_URL } from "../api/api";

const Schema = z.object({
  username: z.string().min(3, { message: "Username is required." }),
  password: z.string().min({ message: "Password is required." }),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(Schema) });

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to login.");
        console.log(data);

        navigate("/");
      } catch (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleLogin = (e) => {
    loginMutation(e);
    reset();
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="flex gap-4 flex-col"
          onSubmit={handleSubmit(handleLogin)}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <FaRegUser />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              {...register("username")}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              {...register("password")}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Login"}
          </button>
          <Link to="/forgot-password" className="mx-auto">
            <button
              type="button"
              className="text-gray-400 underline underline-offset-4 text-center text-sm"
            >
              {"Forgot"} password?
            </button>
          </Link>

          <div className="w-96">
            {isError && <small className="text-red-500">{error.message}</small>}
            {errors.username ? (
              <small className="text-red-500 text-sm">
                {errors.username.message}
              </small>
            ) : errors.password ? (
              <small className="text-red-500 text-sm">
                {errors.password.message}
              </small>
            ) : null}
          </div>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
