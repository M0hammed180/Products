import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useSelector } from "react-redux";
const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";
export default function AddUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setAvatar(file || null);

    if (!file) {
      setPreview(DEFAULT_AVATAR);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", "user");
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("photo", avatar);
    }
    try {
      const response = await api.post("user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
      console.log("Success:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Login Failed:", error.response);
      } else {
        console.error("Network Error:", error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-full  px-4 py-10 sm:px-6 lg:px-8">
        {/* Left Pane */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">


            <form
              onSubmit={handleRegister}
              className="space-y-4 flex flex-col justify-center items-center w-full"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100">
                <label htmlFor="avatar" className="cursor-pointer">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/default-avatar.svg";
                    }}
                  />
                </label>{" "}
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  hidden
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      id="username"
                      name="username"
                      className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition-colors duration-300 placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                      id="phone"
                      name="phone"
                      className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition-colors duration-300 placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      Email
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
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition-colors duration-300 placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </div>

              <div className=" flex justify-around items-center w-full">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-600 p-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
