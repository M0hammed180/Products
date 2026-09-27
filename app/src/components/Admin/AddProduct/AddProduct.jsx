import React, { useState } from "react";
import { Add, XCircle } from "reicon-react";
import api from "../../api";
import { useSelector } from "react-redux";

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

  const { categorys } = useSelector((state) => state.page);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    // maximum 5 images
    if (images.length + selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    const newUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prevImages) => [
      ...prevImages,
      ...selectedFiles,
    ]);

    setImageUrls((prevUrls) => [
      ...prevUrls,
      ...newUrls,
    ]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imageUrls[index]);

    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index)
    );

    setImageUrls((currentUrls) =>
      currentUrls.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSizeChange = (event) => {
    const { value, checked } = event.target;

    setSizes((currentSizes) =>
      checked
        ? [...currentSizes, value]
        : currentSizes.filter((size) => size !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("stock", Number(formData.stock));
      data.append("category", formData.category);

      data.append(
        "size",
        JSON.stringify(
          sizes.map((size) => ({
            size,
          }))
        )
      );

      // send images as multipart/form-data
      images.forEach((image) => {
        data.append("images", image);
      });

      const res = await api.post("product/", data);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center md:p-12">
        <div className="mx-auto w-full max-w-137.5 md:bg-zinc-900 text-white md:rounded-3xl">
          <form
            className="py-6 px-9"
            onSubmit={handleSubmit}
          >
            {imageUrls.length > 0 ? (
              <div className="flex gap-2 mb-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="h-32 w-32 rounded-lg border-2 border-gray-300 bg-gray-100 relative"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-3 -left-3 rounded-full backdrop-blur-sm"
                    >
                      <XCircle
                        color="red"
                        size={30}
                      />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <div className="h-32 w-32 overflow-hidden rounded-lg border-2 border-zinc-600 bg-zinc-800 flex justify-center items-center">
                    <input
                      type="file"
                      name="file"
                      id="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <label htmlFor="file">
                      <Add size={90} />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6 pt-4">
                <label className="mb-5 block text-xl font-semibold">
                  Upload File
                </label>

                <div className="mb-8">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="file"
                    className="relative flex h-36 items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    <div>
                      <span className="mb-2 block text-xl font-semibold">
                        Drop files here
                      </span>

                      <span className="mb-2 block text-base font-medium">
                        Or
                      </span>

                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium"
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
                className="w-full rounded-md border border-[#e0e0e0] bg-zinc-800 text-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                <option value="">
                  Select a category
                </option>

                {categorys.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
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
                {[
                  "Small",
                  "Medium",
                  "Large",
                  "XL",
                  "2XL",
                  "3XL",
                ].map((size) => (
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
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}