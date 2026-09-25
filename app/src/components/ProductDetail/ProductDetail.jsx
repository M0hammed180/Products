import React, { useEffect, useRef, useState } from "react";
import api from "../api";
import Loading from "../Elements/Loading";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart5, HeartSlash, ShoppingCart, Trash9 } from "reicon-react";
import { setCartCount, setFavouritesProductIds } from "../../Redux/pageSlice";
import ProductCard from "../Elements/ProductCard";
import StarRating from "../Elements/StarRating";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { productWhatsAppMessage } from "../../utils/whatsapp";
import {
  addGuestFavourite,
  getGuestCart,
  isGuestFavourite,
  removeGuestCartItem,
  removeGuestFavourite,
  setGuestCartItem,
} from "../../utils/guestCart";
import { FaPhone } from "react-icons/fa";

const starPath =
  "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z";

function Rating({ value, onChange, interactive = true }) {
  return (
    <div className="flex items-center gap-2">
      <output className="min-w-5 text-center text-base font-semibold text-stone-500">
        {value || 0}
      </output>
      <div className="inline-flex items-center" aria-label="Product rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={value === star}
            onClick={() => interactive && onChange(star)}
            className="rounded p-0.5 text-zinc-300 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={value >= star ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={starPath} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cartCount } = useSelector((state) => state.page);
  const [selectedImage, setSelectedImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [star, setStar] = useState(1);
  const [count, setCount] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [cartData, setCartData] = useState({});
  const [products, setProducts] = useState([]);
  const productsRef = useRef(null);

  const { avatar, userId } = useSelector((state) => state.user);
  const { cartProductIds, favouritesProductIds } = useSelector(
    (state) => state.page,
  );
  //comment
  const fetchComments = async () => {
    try {
      const response = await api.get(`/comment/${id}`);
      setComments(response.data.comments || response.data || []);
      console.log(response.data.comments);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  };

  //product
  const fetchProduct = async () => {
    try {
      if (userId) {
        setLoading(true);
        const response = await api.get(
          `product/product_detail/${id}/${userId}`,
        );
        setProduct(response.data.productDea);
        setCartData({
          isinCart: response.data.isinCart,
          count: response.data.count,
        });
        setProducts(response.data.sameProducts);
      } else {
        setLoading(true);
        const response = await api.get(`product/product_detail_no_login/${id}`);
        setProduct(response.data.productDea);
        const guestCart = await getGuestCart();
        const cartArray = Object.entries(guestCart).map(
          ([productId, count]) => ({
            productId,
            count,
          }),
        );
        const cartItem = cartArray.find((item) => item.productId === id);
        const isProductInCart = !!cartItem;
        const productCount = cartItem ? cartItem.count : 0;
        setCartData({
          isinCart: isProductInCart,
          count: productCount,
        });
        setProducts(response.data.sameProducts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const myStock = Math.max(0, (product?.stock || 0) - (cartData?.count || 0));

  //cart
  const addtoCart = async () => {
    if (!userId) {
      setGuestCartItem(id, count);
      setCartData({ count: count, isinCart: true });
      dispatch(setCartCount(cartCount + 1));
      return;
    }
    try {
      await api.post("cart/add", {
        productId: id,
        userId,
        count,
      });
      setCartData({ count: count, isinCart: true });
      dispatch(setCartCount(cartCount + 1));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const editCountCart = async (type) => {
    if (!userId) {
      setCartData((prev) => {
        const newCount = type === "increase" ? prev.count + 1 : prev.count - 1;
        setGuestCartItem(id, newCount);
        return { ...prev, count: newCount };
      });
      return;
    }
    try {
      await api.post("cart/edit", {
        productId: id,
        userId,
        type,
      });
      if (type == "increase") {
        setCartData((prev) => ({ ...prev, count: prev.count + 1 }));
      } else {
        setCartData((prev) => ({ ...prev, count: prev.count - 1 }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteProfromCart = async () => {
    if (!userId) {
      removeGuestCartItem(id);
      setCartData((prev) => ({ ...prev, isinCart: false }));
      dispatch(setCartCount(cartCount - 1));
      return;
    }
    try {
      await api.post("cart/delete", {
        productId: id,
        userId,
      });
      setCartData((prev) => ({ ...prev, isinCart: false }));
      dispatch(setCartCount(cartCount - 1));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addtoFavourites = async () => {
    if (!userId) {
      addGuestFavourite(id);
      dispatch(setFavouritesProductIds([...favouritesProductIds, id]));
      return;
    }
    try {
      await api.post("favourites/add", { productId: id, userId });
      dispatch(setFavouritesProductIds([...favouritesProductIds, id]));
    } catch (error) {
      console.error("Error adding product to favourites:", error);
    }
  };

  const deleteProfromFavourites = async () => {
    if (!userId) {
      removeGuestFavourite(id);
      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((item) => item !== id),
        ),
      );
      return;
    }
    try {
      await api.post("favourites/delete", { productId: id, userId });
      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((productId) => productId !== id),
        ),
      );
    } catch (error) {
      console.error("Error removing product from favourites:", error);
    }
  };

  const scrollProducts = (direction) => {
    productsRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchProduct();
    if (userId) {
      fetchComments();
    }
  }, [id, userId]);

  const trackProductEvent = async () => {
    try {
      console.log(userId);
      await api.post("product/event_product", {
        productId: id,
        userId: userId,
      });
    } catch (error) {
      console.error(
        "Failed to track product event:",
        error.response?.data?.message,
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      trackProductEvent();
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, userId]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black pb-8 pt-28 font-sans antialiased text-zinc-900 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              aria-label="تكبير صورة المنتج"
              className="mb-4 flex h-64 w-full cursor-zoom-in items-center justify-center rounded-lg bg-zinc-900 md:h-80"
            >
              <img
                className="h-full w-full object-contain"
                src={selectedImage || product?.images?.[0]}
                alt={product?.name || "Product"}
              />
            </button>
            <div className="mb-4 flex gap-3 overflow-x-auto">
              {product?.images?.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`h-24 w-24 shrink-0 rounded-lg bg-white p-1 ${selectedImage === image ? "ring-2 ring-white" : ""}`}
                >
                  <img
                    src={image}
                    className="h-full w-full object-contain"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold leading-tight text-white md:text-3xl">
              {product.name}
            </h2>
            <div className="flex w-full justify-between">
              <div className="my-4 flex items-center gap-2">
                <span className="rounded-lg bg-white px-3 py-2 text-3xl font-bold text-zinc-950">
                  ج.م.{product.discountPrice || product.price}
                </span>

                {product.discountPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    ج.م.{product.price}
                  </span>
                )}
              </div>
              <div className="flex flex-row-reverse items-center gap-1 ">
                {/* <p className="text-white">:stcock</p>{" "} */}
                <p className="rounded-lg bg-white px-3 py-2 md:text-xl font-bold text-zinc-950">
                  {myStock}
                </p>
              </div>
            </div>

            <p className="text-zinc-400">{product.description}</p>
            {cartData.isinCart ? (
              <div className="my-5 inline-flex w-fit items-center justify-between gap-2 rounded-full border border-zinc-700 bg-zinc-900 p-2 shadow-lg shadow-black/20 max-md:w-full">
                {cartData.count <= 1 ? (
                  <button
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-500/40 bg-zinc-500/10 text-xl font-medium text-zinc-300 transition-colors hover:bg-zinc-500 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    type="button"
                    aria-label="Remove from cart"
                    onClick={deleteProfromCart}
                  >
                    <Trash9 />
                  </button>
                ) : (
                  <button
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-500/40 bg-zinc-500/10 text-xl font-medium text-zinc-300 transition-colors hover:bg-zinc-500 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => editCountCart("decrease")}
                  >
                    <span className="sr-only">Decrease quantity</span>

                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                )}

                <div className="mx-1">
                  <input
                    type="number"
                    className="h-10 w-16 rounded-xl border border-zinc-700 bg-zinc-950 px-2 text-center text-lg font-bold text-white outline-none"
                    readOnly
                    value={cartData.count}
                  />
                </div>

                <button
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-500/40 bg-zinc-500/10 text-xl font-medium text-zinc-300 transition-colors hover:bg-zinc-500 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-zinc-500/10 disabled:hover:text-zinc-300"
                  aria-label="Increase quantity"
                  type="button"
                  disabled={cartData.count >= myStock}
                  onClick={() => editCountCart("increase")}
                >
                  <span className="sr-only">Increase quantity</span>

                  <svg
                    className="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex w-full flex-row-reverse items-center gap-3 py-5">
                <label className="relative block w-28 shrink-0">
                  <select
                    disabled={myStock <= 0}
                    dir="ltr"
                    value={count}
                    onChange={(event) => setCount(Number(event.target.value))}
                    className="h-12 w-full cursor-pointer appearance-none rounded-full border border-zinc-700 bg-zinc-900 px-4 text-base font-semibold text-white outline-none transition-colors focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Array.from(
                      { length: Math.min(myStock, 5) },
                      (_, index) => index + 1,
                    ).map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                  </select>

                  <svg
                    className="pointer-events-none absolute bottom-4 right-3 h-4 w-4 text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m8 9 4 4 4-4"
                    />
                  </svg>
                </label>

                <button
                  disabled={myStock <= 0}
                  type="button"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-4 py-3 font-semibold text-zinc-100 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-60 disabled:hover:border-zinc-700 disabled:hover:text-zinc-500"
                  onClick={addtoCart}
                >
                  <ShoppingCart />

                  {myStock <= 0 ? "غير متوفر" : "أضف إلى السلة"}
                </button>
              </div>
            )}
            <div className=" flex flex-col gap-4 sm:flex-row">
              {isGuestFavourite(id) ? (
                <button
                  type="button"
                  onClick={deleteProfromFavourites}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-4 py-3 font-semibold text-zinc-100 transition hover:border-amber-400 hover:text-amber-300"
                >
                  <HeartSlash />
                  إزالة من المفضلة
                </button>
              ) : (
                <button
                  type="button"
                  onClick={addtoFavourites}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-4 py-3 font-semibold text-zinc-100 transition hover:border-amber-400 hover:text-amber-300"
                >
                  <Heart5 />
                  أضف إلى المفضلة
                </button>
              )}
              <WhatsAppButton
                message={productWhatsAppMessage({
                  name: product.name,
                  price: product.discountPrice || product.price,
                  image: product.images?.[0],
                })}
                className="flex-1"
              >
                التحدث بخصوص المنتج
              </WhatsAppButton>
              <a
                href="tel:01200105320"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 mb-4 w-full"
              >
                <FaPhone className="h-5 w-5" aria-hidden="true" />
                <span>الاتصال عبر الهاتف</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* products */}
      <section className="my-10 px-4 sm:px-6 lg:px-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              قد يعجبك أيضًا
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              منتجات مشابهة
            </h2>
          </div>
          <div className="flex shrink-0 gap-2 not-md:hidden">
            <button
              type="button"
              aria-label="Scroll related products right"
              onClick={() => scrollProducts(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-amber-400 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span aria-hidden="true" className="text-xl">
                &rarr;
              </span>
            </button>
            <button
              type="button"
              aria-label="Scroll related products left"
              onClick={() => scrollProducts(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-amber-400 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span aria-hidden="true" className="text-xl">
                &larr;
              </span>
            </button>
          </div>
        </div>
        <div
          ref={productsRef}
          className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => {
            const cartItem = cartProductIds.find(
              (item) => item.productId === product._id,
            );
            const isProductInCart = !!cartItem;
            const productCount = cartItem ? cartItem.count : 0;
            const isinmyFavourites = favouritesProductIds.includes(product._id);

            return (
              <Link
                key={product._id}
                to={`/product_detail/${product._id}`}
                className="w-[min(78vw,180px)] md:w-[min(78vw,280px)] shrink-0 snap-start sm:w-70"
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
      </section>
      {/* <section className="mt-10 w-full space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">التعليقات</h2>
            <p className="mt-1 text-sm text-zinc-400">
              شاركنا رأيك عن هذا المنتج
            </p>
          </div>
          <div className="flex gap-2 md:gap-5">
            <button
              onClick={() => setStartComment(true)}
              className="rounded-full border border-zinc-600 px-3 py-1 text-xs font-semibold text-zinc-300 cursor-pointer"
            >
              أضف تعليقًا
            </button>
            <span className="rounded-full border border-zinc-600 px-3 py-1 text-xs font-semibold text-zinc-300">
              {comments.length}
            </span>
          </div>
        </div>

        {startComment && (
          <div
            onClick={() => setStartComment(false)}
            className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md sm:py-12"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl"
            >
              <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
                <div className="border-b border-zinc-800 px-6 py-6 sm:px-10">
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                    رأيك يهمنا!
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    قيّم المنتج وشاركنا تجربتك.
                  </p>
                </div>
                <div className="w-full bg-zinc-900 px-6 py-7 sm:px-10">
                  <form
                    onSubmit={addComment}
                    className="flex flex-col items-center"
                  >
                    <div className="flex w-full flex-col items-center gap-5">
                      <span className="text-lg text-zinc-200">
                        كيف تقيّم هذا المنتج؟
                      </span>
                      <Rating value={star} onChange={setStar} />
                      <div className="w-full">
                        <textarea
                          autoComplete="off"
                          id="comment"
                          name="comment"
                          rows={4}
                          value={commentText}
                          onChange={(event) =>
                            setCommentText(event.target.value)
                          }
                          className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-zinc-400"
                          placeholder="اكتب تعليقك هنا إن أردت"
                        />
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => {
                              setCommentText("");
                              setStar(0);
                              setStartComment(false);
                            }}
                            className="order-2 w-full rounded-xl border border-zinc-700 px-4 py-3 text-base text-zinc-300 transition-colors hover:bg-zinc-800 sm:order-1"
                          >
                            لاحقًا
                          </button>
                          <button
                            type="submit"
                            disabled={!commentText.trim() || !star}
                            className="order-1 w-full rounded-xl bg-white px-4 py-3 text-base font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 sm:order-2"
                          >
                            قيّم الآن
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex h-16 items-center justify-center border-t border-zinc-800 bg-zinc-950">
                  <button
                    type="button"
                    onClick={() => {
                      setCommentText("");
                      setStar(0);
                      setStartComment(false);
                    }}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {comments.map((comment) => {
            const isMyComment =
              comment.userId?._id === userId || comment.userId === userId;
            return (
              <div
                key={comment._id}
                className="flex items-start gap-3 border-b border-zinc-700 py-4"
              >
                <img
                  src={comment.userId?.avatar || avatar}
                  alt={comment.userId?.name || "User"}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold text-white">
                      {comment.userId?.name || "Anonymous"}
                    </span>
                    {comment.rating > 0 && (
                      <Rating
                        value={comment.rating}
                        onChange={() => {}}
                        interactive={false}
                      />
                    )}
                  </div>
                  {editingId === comment._id ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        className="min-w-0 flex-1 border-b border-zinc-600 bg-transparent text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment._id)}
                        className="text-xs text-white hover:underline"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 wrap-break-word text-sm leading-6 text-zinc-300">
                      {comment.text}
                    </p>
                  )}
                </div>
                {isMyComment && editingId !== comment._id && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditText(comment.text);
                      }}
                      className="text-xs text-zinc-300 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section> */}

      {showPreview && (
        <div
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
        >
          <img
            src={selectedImage || product?.images?.[0]}
            alt={product?.name || "Product"}
            className="max-h-full max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            aria-label="إغلاق"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-2xl text-white"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
