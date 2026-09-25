import React, { useEffect, useState } from "react";
import api from "../../api";
import Loading from "../../Elements/Loading";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../Redux/pageSlice";
import ProductCard from "../../Elements/ProductCard";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [search, setSearch] = useState("");
  // const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const { search, category } = useSelector((state) => state.page);
  const { role } = useSelector((state) => state.user);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("product/products", {
        params: { page, category },
      });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(`product/${productId}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
      window.alert("Unable to delete the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // const handleSearchChange = (event) => {
  //   dispatch(setSearch(event.target.value));
  //   setPage(1);
  // };

  // const handleCategoryChange = (event) => {
  //   setCategory(event.target.value);
  //   setPage(1);
  // };

  const filteredProducts = products.filter((product) => {
    const searchValue = search?.trim()?.toLowerCase();

    if (!searchValue) return true;

    return (
      product.name?.toLowerCase().includes(searchValue) ||
      product.description?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div>
      <div className="md:flex flex-col hidden">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full ">
            <div className="overflow-hidden">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="border-b border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, index) => (
                    <tr
                      key={p._id}
                      className={`rounded-lg border-b border-zinc-600 text-zinc-100 transition hover:bg-zinc-600 ${
                        index % 2 === 0 ? "bg-zinc-700" : "bg-zinc-900"
                      }`}
                    >
                      <td className="whitespace-nowrap rounded-r-lg px-6 py-4 text-sm font-medium">
                        <Link to={`/edit_product/${p._id}`}>
                          <div className="flex gap-[0.5px]">
                            {p?.images?.map((i) => (
                              <div key={i} className="flex-1 px-2">
                                <div
                                  type="button"
                                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white focus:outline-none  `}
                                >
                                  <img
                                    src={i}
                                    className="w-full h-full"
                                    alt=""
                                  />{" "}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        <Link
                          to={`/edit_product/${p._id}`}
                          className="font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        ${p.price}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        {p.stock}
                      </td>
                      <td className="whitespace-nowrap rounded-l-lg px-6 py-4 text-sm font-light">
                        <div className="flex gap-2">
                          <Link
                            to={`/edit_product/${p._id}`}
                            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="rounded-md bg-red-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                            onClick={() => deleteProduct(p._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:hidden mt-10 px-5">
        {filteredProducts.map((product) => {
          return (
            <Link
              key={product._id}
              to={`/edit_product/${product._id}`}
              className="min-w-0"
            >
              <ProductCard
                image={product.images}
                name={product.name}
                price={product.price}
                discountPrice={product.discountPrice}
                id={product._id}
                role={role}
              />
            </Link>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
        <span>
          Page {pagination.page} of {pagination.totalPages} (
          {pagination.totalProducts} products)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-md bg-zinc-200 px-4 py-2 font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-800 dark:text-white"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
