import React, { useEffect, useState } from "react";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { HeartAdd, Trash9 } from "reicon-react";
import { setCartCount } from "../../Redux/pageSlice";
import { Link, useNavigate } from "react-router-dom";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { productWhatsAppMessage } from "../../utils/whatsapp";
import {
  getGuestCart,
  setGuestCartItem,
  removeGuestCartItem,
  addGuestFavourite,
} from "../../utils/guestCart";
import { FaPhone } from "react-icons/fa";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartCount } = useSelector((state) => state.page);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const { userId, isAuthenticated } = useSelector((state) => state.user);

  // مسجل دخول ولا زائر
  const isLoggedIn = Boolean(isAuthenticated && userId);

  const subtotal = cart.reduce((acc, item) => {
    if (item.productId?.price) return acc + item.productId.price * item.count;
    return acc;
  }, 0);
  const shipping = 50;
  const discount = subtotal > 100 ? 50 : 0;
  const total = subtotal + (subtotal ? shipping : 0) - discount;
  const validCartItems = cart.filter((item) => item.productId);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .get(`cart/mycartpro/${userId}`)
        .then((response) => {
          if (response.data.myCart)
            setCart(response.data.myCart.products || []);
        })
        .catch((error) => console.log("Error fetching cart", error));
      return;
    }

    const guestCart = getGuestCart(); // { [productId]: count }
    const productIds = Object.keys(guestCart);

    if (productIds.length === 0) {
      setCart([]);
      return;
    }

    Promise.all(
      productIds.map((id) =>
        api
          .get(`product/product_no_login/${id}`) // TODO: غيّر اسم الراوت ده لو مختلف عندك
          .then((res) => ({
            productId: res.data.productDea,
            count: guestCart[id],
          }))
          .catch(() => null),
      ),
    ).then((items) => {
      setCart(items.filter(Boolean));
    });
  }, [isLoggedIn, userId]);

  const editCountCart = async (type, id) => {
    if (!isLoggedIn) {
      setCart((prevItems) =>
        prevItems.map((item) => {
          if (item.productId?._id !== id) return item;
          const newCount =
            type === "increase" ? item.count + 1 : item.count - 1;
          setGuestCartItem(id, newCount);
          return { ...item, count: newCount };
        }),
      );
      return;
    }
    try {
      await api.post("cart/edit", { productId: id, userId, type });
      setCart((prevItems) =>
        prevItems.map((item) => {
          if (item.productId?._id !== id) return item;
          return {
            ...item,
            count: type === "increase" ? item.count + 1 : item.count - 1,
          };
        }),
      );
    } catch (error) {
      console.error("Error editing count:", error);
    }
  };

  const deleteProfromCart = async (id) => {
    if (!isLoggedIn) {
      removeGuestCartItem(id);
      setCart((prev) => prev.filter((item) => item.productId?._id !== id));
      dispatch(setCartCount(Math.max(0, cartCount - 1)));
      return;
    }
    try {
      await api.post("cart/delete", { productId: id, userId });
      setCart((prev) => prev.filter((item) => item.productId?._id !== id));
      dispatch(setCartCount(Math.max(0, cartCount - 1)));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const placeOrder = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!validCartItems.length || submitting) return;

    setSubmitting(true);
    setOrderError("");
    try {
      const response = await api.post("/order/add", { userId, total });
      dispatch(setCartCount(0));
      setCart([]);
      setShowConfirmModal(false);
      navigate(`/order/${response.data.order._id}`);
    } catch (error) {
      setOrderError(
        error.response?.data?.message || "تعذر إنشاء الطلب. حاول مرة أخرى.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const QuantityControls = ({ item }) => (
    <div
      className="flex items-center gap-2"
      aria-label={`Quantity: ${item.count}`}
    >
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-lg font-medium text-zinc-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        aria-label={`Decrease quantity of ${item.productId.name}`}
        onClick={() => editCountCart("decrease", item.productId._id)}
        disabled={item.count <= 1}
      >
        −
      </button>
      <span className="flex h-9 min-w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-950 px-2 text-sm font-semibold text-white">
        {item.count}
      </span>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-lg font-medium text-zinc-200 transition hover:bg-zinc-700"
        type="button"
        aria-label={`Increase quantity of ${item.productId.name}`}
        onClick={() => editCountCart("increase", item.productId._id)}
      >
        +
      </button>
    </div>
  );

  //favourites
  const addtoFavourites = async (id) => {
    if (!isLoggedIn) {
      addGuestFavourite(id);
      deleteProfromCart(id);
      return;
    }
    try {
      await api.post("favourites/add", {
        productId: id,
        userId,
      });
      deleteProfromCart(id);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const RemoveButton = ({ product }) => (
    <button
      onClick={() => deleteProfromCart(product._id)}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
    >
      <Trash9 size={20} />
      <span className="md:hidden">إزالة</span>
    </button>
  );

  const FavButton = ({ product, className }) => (
    <button
      onClick={() => addtoFavourites(product._id)}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200 ${className}`}
    >
      <HeartAdd size={20} />
      <span className="text-sm md:hidden">نقل إلى المفضلة</span>
    </button>
  );

  return (
    <main className="min-h-screen bg-black px-3 pb-8 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 lg:flex-row lg:gap-8">
        <section className="w-full lg:w-2/3">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">
                راجع منتجاتك قبل تأكيد الطلب
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                سلة التسوق
              </h1>
            </div>
            <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
              {validCartItems.length}{" "}
              {validCartItems.length === 1 ? "منتج" : "منتجات"}
            </span>
          </div>

          {validCartItems.length === 0 ? (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-8 text-center shadow-xl">
              <h2 className="text-lg font-semibold text-white">
                سلة التسوق فارغة
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                أضف منتجات لتظهر هنا.
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
              <div
                className="hidden overflow-hidden  rounded-2xl border border-zinc-700 shadow-xl md:block"
                dir="rtl"
              >
                <table className=" text-left w-full min-w-180 text-sm text-zinc-300">
                  <thead className="bg-zinc-900 text-xs uppercase text-zinc-400">
                    <tr>
                      <th scope="col" className="px-5 py-4">
                        المنتج
                      </th>
                      <th scope="col" className="px-5 py-4">
                        الكمية
                      </th>
                      <th scope="col" className="px-5 py-4">
                        السعر
                      </th>
                      <th scope="col" className="px-5 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {validCartItems.map((item) => (
                      <tr
                        key={item.productId._id}
                        className="border-t border-zinc-700 bg-zinc-800 transition hover:bg-zinc-700"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/product_detail/${item.productId._id}`}
                            className="flex min-w-0 items-center gap-4"
                          >
                            <img
                              src={item.productId.images?.[0] || ""}
                              className="h-20 w-16 shrink-0 rounded-lg bg-zinc-900 object-cover"
                              alt={item.productId.name}
                            />
                            <span className="truncate font-semibold text-white">
                              {item.productId.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <QuantityControls item={item} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">
                          ${(item.productId.price * item.count).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <WhatsAppButton
                              message={productWhatsAppMessage({
                                name: item.productId.name,
                                price: item.productId.price,
                                image: item.productId.images?.[0],
                              })}
                              className="whitespace-nowrap"
                            ></WhatsAppButton>
                            <a
                              href="tel:01200105320"
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 "
                            >
                              <FaPhone className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <FavButton
                              product={item.productId}
                              className="whitespace-nowrap"
                            />

                            <RemoveButton product={item.productId} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {validCartItems.map((item) => (
                  <article
                    key={item.productId._id}
                    className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg"
                  >
                    <Link
                      to={`/product_detail/${item.productId._id}`}
                      className="flex min-w-0 gap-3"
                    >
                      <img
                        src={item.productId.images?.[0] || ""}
                        className="h-24 w-20 shrink-0 rounded-xl bg-zinc-900 object-cover"
                        alt={item.productId.name}
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h2 className="truncate font-semibold text-white">
                            {item.productId.name}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-400">
                            ج.م.{item.productId.price} للقطعة
                          </p>
                        </div>
                        <p className="mt-2 text-lg font-bold text-white">
                          ج.م.{(item.productId.price * item.count).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-700 pt-3">
                      <QuantityControls item={item} />
                      <RemoveButton product={item.productId} />
                    </div>
                    <WhatsAppButton
                      message={productWhatsAppMessage({
                        name: item.productId.name,
                        price: item.productId.price,
                        image: item.productId.images?.[0],
                      })}
                      className="mt-3 w-full"
                    >
                      التحدث بخصوص المنتج
                    </WhatsAppButton>
                    <a
                      href="tel:01200105320"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 mt-3 w-full"
                    >
                      <FaPhone className="h-5 w-5" aria-hidden="true" />
                      <span>الاتصال عبر الهاتف</span>
                    </a>
                    <FavButton
                      className="mt-3 w-full"
                      product={item.productId}
                    />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-5 shadow-xl sm:p-6 lg:sticky lg:top-24 lg:w-1/3">
          <h2 className="border-b border-zinc-700 pb-3 text-xl font-bold">
            ملخص الطلب
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-zinc-300">
              <dt>الإجمالي الفرعي</dt>
              <dd>ج.م.{subtotal.toFixed(2)}</dd>
            </div>
            {subtotal > 0 && (
              <div className="flex justify-between gap-4 text-zinc-300">
                <dt>الشحن</dt>
                <dd>ج.م.{shipping.toFixed(2)}</dd>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between gap-4 text-amber-400">
                <dt>الخصم</dt>
                <dd>-ج.م.{discount.toFixed(2)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-5 flex justify-between gap-4 border-t border-zinc-700 pt-4 text-lg font-bold">
            <span>الإجمالي</span>
            <span>ج.م.{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
                return;
              }
              setShowConfirmModal(true);
            }}
            disabled={validCartItems.length === 0}
            className="mt-6 min-h-12 w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-black transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggedIn ? "تأكيد الطلب" : "سجل دخول عشان تكمل الطلب"}
          </button>
        </aside>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-white shadow-2xl sm:p-6">
            <h2 className="text-xl font-bold">تأكيد الطلب</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              هل تريد إنشاء الطلب بإجمالي ج.م.{total.toFixed(2)}؟
            </p>
            {orderError && (
              <p className="mt-3 text-sm text-red-300">{orderError}</p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="min-h-11 rounded-xl bg-zinc-700 px-4 py-2 text-zinc-100 transition hover:bg-zinc-600"
              >
                إلغاء
              </button>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="min-h-11 rounded-xl bg-amber-400 px-4 py-2 text-center font-semibold text-black transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "جارٍ إنشاء الطلب..." : "تأكيد الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
