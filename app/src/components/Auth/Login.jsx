import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../Redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, userId } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userId) syncGuestDataToServer(userId, dispatch);
  }, [userId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await api.post("user/login", {
        email: email,
        password: password,
      });

      console.log("Success:", response.data.message);
      localStorage.setItem("token", response.data.token);

      const decoded = jwtDecode(response.data.token);
      console.log(decoded);

      dispatch(setUserData(decoded));
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error);
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <div className="pt-25 flex min-h-screen justify-center px-4 py-10 bg-zinc-50 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="w-full  lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h1 className="mb-6 text-center text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
              تسجيل الدخول
            </h1>
            <h1 className="mb-6 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-300">
              انضم إلى مجتمعنا واستمتع بتجربة تسوق سهلة
            </h1>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-center">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Your form elements go here */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  البريد الإلكتروني
                </label>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition-colors duration-300 placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  كلمة المرور
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition-colors duration-300 placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">
              <p>
                ليس لديك حساب؟{" "}
                <Link
                  to="/register"
                  className="font-medium text-cyan-700 hover:underline dark:text-cyan-300"
                >
                  أنشئ حسابًا
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
