import React, { useState } from "react";
import { Add, XCircle } from "reicon-react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    setImageUrls((prevUrls) => [...prevUrls, ...newUrls]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imageUrls[index]);
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
    setImageUrls((currentUrls) =>
      currentUrls.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSizeChange = (event) => {
    const { value, checked } = event.target;
    setSizes((currentSizes) =>
      checked
        ? [...currentSizes, value]
        : currentSizes.filter((size) => size !== value),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      size: sizes.map((size) => ({ size })),
      photo: images,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-137.5 bg-zinc-900 text-white rounded-3xl">
          <form className="py-6 px-9" onSubmit={handleSubmit}>
            {imageUrls.length > 0 ? (
              <div className="flex gap-2 mb-2">
                {" "}
                {imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="h-32 w-32  rounded-lg border-2 border-gray-300 bg-gray-100 relative"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className=" absolute -top-3 -left-3 rounded-full backdrop-blur-sm"
                    >
                      <XCircle color="red" size={30} />
                    </button>
                  </div>
                ))}
                <div className="h-32 w-32 overflow-hidden rounded-lg border-2 border-zinc-600 bg-zinc-800 flex justify-center items-center">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                    multiple
                    onChange={handleImageChange}
                    hidden
                  />
                  <label htmlFor="file">
                    {" "}
                    <Add size={90} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="mb-6 pt-4">
                <label className="mb-5 block text-xl font-semibold ">
                  Upload File
                </label>
                <div className="mb-8">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                    multiple
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="file"
                    className="relative flex h-36 items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    <div>
                      <span className="mb-2 block text-xl font-semibold ">
                        Drop files here
                      </span>
                      <span className="mb-2 block text-base font-medium ">
                        Or
                      </span>
                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium ">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>
                {/* <div className="mb-5 rounded-md bg-[#F5F7FB] py-4 px-8">
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-base font-medium ">
                    banner-design.png
                  </span>
                  <button className="">
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div> */}
              </div>
            )}{" "}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium "
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="T-shirt"
                className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 text-white py-3 px-6 text-base font-medium  outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="description"
                className="mb-3 block text-base font-medium"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Red t-shirt anime"
                rows="3"
                className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 px-6 py-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-3 block text-base font-medium"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 px-6 py-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="mb-3 block text-base font-medium"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 px-6 py-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="category"
                className="mb-3 block text-base font-medium"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 px-6 py-3 text-base font-medium text-white outline-none focus:border-[#6A64F1] focus:shadow-md"
              >
                <option value="">Select a category</option>
                <option value="tshirts">T-Shirts</option>
                <option value="pantalons">Pantalons</option>
                <option value="shoes">Shoes</option>
              </select>
            </div>
            <div className="mb-5">
              <label
                htmlFor="sizes"
                className="mb-3 block text-base font-medium"
              >
                Sizes
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Small", "Medium", "Large", "XL", "2XL", "3XL"].map(
                  (size) => (
                    <label
                      key={size}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition ${
                        sizes.includes(size)
                          ? "border-[#6A64F1] bg-[#6A64F1]/20 text-white"
                          : "border-[#e0e0e0] bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="sizes"
                        value={size}
                        checked={sizes.includes(size)}
                        onChange={handleSizeChange}
                        className="accent-[#6A64F1]"
                      />
                      {size}
                    </label>
                  ),
                )}
              </div>
            </div>
            <div>
              <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
