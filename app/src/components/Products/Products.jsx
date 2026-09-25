import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "../Elements/Loading";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../Elements/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const {
    search,
    searchOrder,
    category,
    cartProductIds,
    favouritesProductIds,
  } = useSelector((state) => state.page);
  const { userId } = useSelector((state) => state.user);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("product/products", {
        params: { page, search, category },
      });
      setProducts(response.data.products ?? []);
      setPagination(response.data.pagination);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchOrder, category]);

  useEffect(() => {
    setPage(1);
  }, [searchOrder, category]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-10 pt-25">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          {/* <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            Shyaka collection
          </p> */}
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl capitalize">
            {category === "clothes"
              ? "ملابس"
              : category === "electronics"
                ? "اجهزة"
                : category === "shoes"
                  ? "أحذية"
                  : "المنتجات"}
          </h1>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-800 bg-red-950/60 p-5 text-red-200">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 text-zinc-300">
            لا توجد منتجات متاحة حاليًا.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const cartItem = cartProductIds.find(
                (item) => item.productId === product._id,
              );
              const isProductInCart = !!cartItem;
              const productCount = cartItem ? cartItem.count : 0;
              const isinmyFavourites = favouritesProductIds.includes(
                product._id,
              );

              return (
                <Link
                  key={product._id}
                  to={`/product_detail/${product._id}`}
                  className="min-w-0"
                >
                  <ProductCard
                    image={product.images}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    isProductInCart={isProductInCart}
                    productCount={productCount}
                    id={product._id}
                    userId={userId}
                    count={1}
                    isinmyFavourites={isinmyFavourites}
                    ratingCount={product.ratingCount}
                    ratingAvg={product.ratingAverage}
                    stock={product.stock}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-5 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
            <span>
              صفحة {pagination.page} من {pagination.totalPages} (
              {pagination.totalProducts} منتج)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded-md bg-zinc-800 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                السابق
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded-md bg-white px-4 py-2 font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
