import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Add, XCircle } from "reicon-react";
import api from "../../api";
import Loading from "../../Elements/Loading";
import { useSelector } from "react-redux";

const availableSizes = ["Small", "Medium", "Large", "XL", "2XL", "3XL"];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImageUrls, setNewImageUrls] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { categorys } = useSelector((state) => state.page);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`product/product_detail_no_login/${id}`);
        const product = response.data.productDea;
        const productSizes = (product.size || []).map((item) =>
          typeof item === "string" ? item : item.size,
        );

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
        });
        setExistingImages(product.images || []);
        setSizes(productSizes.filter(Boolean));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    setNewImages((currentImages) => [...currentImages, ...selectedFiles]);
    setNewImageUrls((currentUrls) => [
      ...currentUrls,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = "";
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImageUrls[index]);
    setNewImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
    setNewImageUrls((currentUrls) =>
      currentUrls.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const removeExistingImage = (image) => {
    setExistingImages((currentImages) =>
      currentImages.filter((currentImage) => currentImage !== image),
    );
  };

  const handleSizeChange = (event) => {
    const { value, checked } = event.target;
    setSizes((currentSizes) =>
      checked
        ? [...currentSizes, value]
        : currentSizes.filter((size) => size !== value),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value),
      );
      data.append("id", id);
      data.append("size", JSON.stringify(sizes.map((size) => ({ size }))));
      existingImages.forEach((image) => data.append("existingImages", image));
      newImages.forEach((image) => data.append("images", image));

      await api.patch("product/", data);
      navigate("/products_admin");
    } catch (error) {
      console.error(error);
      window.alert("Unable to update the product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black p-6 text-white md:p-12">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-zinc-900">
        <form className="space-y-5 p-6 md:p-9" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Update the product information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...existingImages, ...newImageUrls].map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-28 rounded-lg bg-zinc-800 p-2"
              >
                <img
                  src={image}
                  alt="Product preview"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() =>
                    index < existingImages.length
                      ? removeExistingImage(image)
                      : removeNewImage(index - existingImages.length)
                  }
                  className="absolute -left-2 -top-2 rounded-full bg-zinc-950"
                >
                  <XCircle color="red" size={26} />
                </button>
              </div>
            ))}
            <label className="flex h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-600 bg-zinc-800 hover:bg-zinc-700">
              <input
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <Add size={52} />
            </label>
          </div>

          <div>
            <label
              htmlFor="edit-name"
              className="mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="edit-price"
                className="mb-2 block text-sm font-medium"
              >
                Price
              </label>
              <input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
              />
            </div>
            <div>
              <label
                htmlFor="edit-discountPrice"
                className="mb-2 block text-sm font-medium"
              >
                Discount Price
              </label>
              <input
                id="edit-discountPrice"
                name="discountPrice"
                type="number"
                min="0"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
              />
            </div>
            <div>
              <label
                htmlFor="edit-stock"
                className="mb-2 block text-sm font-medium"
              >
                Stock
              </label>
              <input
                id="edit-stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>
            <select
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-white"
            >
              <option value="">Select a category</option>
              {categorys.map((c) => (
                <option key={c.id} value={c.id} className="">
                  <p className="capitalize">{c.title}</p>
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Sizes</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    value={size}
                    checked={sizes.includes(size)}
                    onChange={handleSizeChange}
                    className="accent-white"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-white px-8 py-3 font-semibold text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
