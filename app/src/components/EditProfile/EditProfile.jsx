import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Loading from "../Elements/Loading";
import { useSelector } from "react-redux";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";

export default function EditUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { userId, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`user/${userId}`);
        const user = response.data.user;
        console.log(user);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          password: "",
          role: "user",
        });
        setPreview(user.avatar || DEFAULT_AVATAR);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setAvatar(file || null);

    if (!file) {
      setPreview(DEFAULT_AVATAR);
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const data = new FormData();
      data.append("userId", userId);
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("role", "user");

      if (formData.password) data.append("password", formData.password);
      if (avatar) data.append("photo", avatar);

      await api.patch("user/edit", data);
      navigate("/");
    } catch (error) {
      console.error(error);
      window.alert("Unable to update the user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">
          تعديل الملف الشخصي
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="avatar"
            className="mx-auto block h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-zinc-600 bg-zinc-800"
          >
            <img
              src={preview}
              alt="معاينة الصورة الشخصية"
              className="h-full w-full object-cover"
            />
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              الاسم
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              كلمة المرور الجديدة
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="اتركه فارغًا للاحتفاظ بكلمة المرور الحالية"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white outline-none placeholder:text-zinc-500 focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-white p-3 font-semibold text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
