import React, { useEffect, useState } from "react";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { CartAdd, Trash9 } from "reicon-react";
import { setCartCount } from "../../Redux/pageSlice";
import { Link } from "react-router-dom";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { productWhatsAppMessage } from "../../utils/whatsapp";
import {
  getGuestFavourites,
  removeGuestFavourite,
  setGuestCartItem,
} from "../../utils/guestCart";
import { FaPhone } from "react-icons/fa";

export default function Favourites() {
  const dispatch = useDispatch();
  const [favourites, setFavourites] = useState([]);
  const { userId } = useSelector((state) => state.user);
  const { cartCount, favouritesProductIds } = useSelector(
    (state) => state.page,
  );
  //fetchFavourit
  useEffect(() => {
    if (userId) {
      api
        .get(`favourites/myfavouritespro/${userId}`)
        .then((response) => {
          if (response.data.myFavourites)
            setFavourites(response.data.myFavourites.products || []);
        })
        .catch((error) => console.log("Error fetching favourites", error));
    } else {
      const productIds = getGuestFavourites();

      Promise.all(
        productIds.map((id) =>
          api
            .get(`product/product_no_login/${id}`)
            .then((res) => res.data.productDea)
            .catch((error) => console.log(error)),
        ),
      ).then((items) => {
        console.log(items);
        setFavourites(items);
      });
    }
  }, [userId]);

  const deleteProfromFavourites = async (id) => {
    if (!userId) {
      removeGuestFavourite(id);
      dispatch(setFavourites((prev) => prev.filter((item) => item._id !== id)));
      return;
    }
    try {
      await api.post("favourites/delete", { productId: id, userId });
      setFavourites((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addtoCart = async (id) => {
    if (!userId) {
      setGuestCartItem(id);
      dispatch(setCartCount(cartCount + 1));
      return true;
    }
    try {
      await api.post("cart/add", { productId: id, userId, count: 1 });
      dispatch(setCartCount(cartCount + 1));
      return true;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return false;
    }
  };

  const moveToCart = async (id) => {
    if (await addtoCart(id)) await deleteProfromFavourites(id);
  };

  const AddToCartButton = ({ product }) => (
    <button
      onClick={() => moveToCart(product._id)}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-amber-500"
    >
      <CartAdd size={20} />
      أضف للسلة
    </button>
  );

  const RemoveButton = ({ product }) => (
    <button
      onClick={() => deleteProfromFavourites(product._id)}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
    >
      <Trash9 size={20} />
      إزالة
    </button>
  );

  const products = favourites.filter((product) => product?._id);

  return (
    <main className="min-h-screen bg-black px-3 pb-8 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-400">منتجات حفظتها لوقت لاحق</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">المفضلة</h1>
          </div>
          <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
            {products.length} {products.length === 1 ? "منتج" : "منتجات"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-8 text-center shadow-xl">
            <h2 className="text-lg font-semibold">لا توجد منتجات مفضلة بعد</h2>
            <p className="mt-2 text-sm text-zinc-400">
              احفظ المنتجات التي تعجبك وستظهر هنا.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 font-semibold text-black transition hover:bg-amber-500"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-700 shadow-xl md:block">
              <table className="w-full min-w-170 text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 text-xs uppercase text-zinc-400">
                  <tr>
                    <th scope="col" className="px-5 py-4">
                      المنتج
                    </th>
                    <th scope="col" className="px-5 py-4">
                      السعر
                    </th>
                    <th scope="col" className="px-5 py-4 text-left">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-zinc-700 bg-zinc-800 transition hover:bg-zinc-700"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <img
                            src={product.images?.[0] || ""}
                            className="h-20 w-16 shrink-0 rounded-lg bg-zinc-900 object-cover"
                            alt={product.name}
                          />
                          <span className="truncate font-semibold text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">
                        ${product.price}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <WhatsAppButton
                            message={productWhatsAppMessage({
                              name: product.name,
                              price: product.price,
                              image: product.images?.[0],
                            })}
                            className="whitespace-nowrap"
                          >
                            التحدث بخصوص المنتج
                          </WhatsAppButton>
                          <AddToCartButton product={product} />
                          <RemoveButton product={product} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg"
                >
                  <div className="flex min-w-0 gap-3">
                    <img
                      src={product.images?.[0] || ""}
                      className="h-24 w-20 shrink-0 rounded-xl bg-zinc-900 object-cover"
                      alt={product.name}
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-white">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-lg font-bold text-white">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-700 pt-3 ">
                    <AddToCartButton product={product} />
                    <RemoveButton product={product} />
                  </div>
                  <WhatsAppButton
                    message={productWhatsAppMessage({
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0],
                    })}
                    className="mt-2 w-full"
                  >
                    التحدث بخصوص المنتج
                  </WhatsAppButton>
                  <a
                    href="tel:01200105320"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 mt-2 w-full"
                  >
                    <FaPhone className="h-5 w-5" aria-hidden="true" />
                    <span>الاتصال عبر الهاتف</span>
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
