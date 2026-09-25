import React, { useState } from "react";
import api from "../api";
import Loading from "../Elements/Loading";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartAdd2, Edit, Heart5, HeartSlash, Trash9 } from "reicon-react";
import { setCartCount, setFavouritesProductIds } from "../../Redux/pageSlice";
import WhatsAppButton from "./WhatsAppButton";
import { productWhatsAppMessage } from "../../utils/whatsapp";
import {
  getGuestCartItem,
  setGuestCartItem,
  removeGuestCartItem,
  isGuestFavourite,
  addGuestFavourite,
  removeGuestFavourite,
} from "../../utils/guestCart";

const starPath =
  "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z";

function Rating({ value, onChange, interactive = true }) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center" aria-label="Product rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={value === star}
            onClick={() => interactive && onChange(star)}
            className="touch-manipulation rounded p-1 text-zinc-300 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={value >= star ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={starPath} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductCard({
  image,
  name,
  price,
  discountPrice,
  isProductInCart,
  productCount,
  id,
  userId,
  count,
  isinmyFavourites,
  role,
  forShow,
  stock,
}) {
  const dispatch = useDispatch();

  const { cartCount, favouritesProductIds } = useSelector(
    (state) => state.page,
  );

  const deleteProduct = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await api.delete(`product/${id}`);
    } catch (error) {
      console.log(error);
      window.alert("Unable to delete the product. Please try again.");
    }
  };

  const isLoggedIn = Boolean(userId);

  const [cartData, setCartData] = useState(() => {
    if (!isLoggedIn) {
      const guestCount = getGuestCartItem(id);
      if (guestCount != null) {
        return { count: guestCount, isinCart: true };
      }
    }
    return { count: productCount, isinCart: isProductInCart };
  });

  const isFavourite = isLoggedIn ? isinmyFavourites : isGuestFavourite(id);

  //cart
  const addtoCart = async () => {
    if (!isLoggedIn) {
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
    if (!isLoggedIn) {
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
    if (!isLoggedIn) {
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

  //favourites
  const addtoFavourites = async () => {
    if (!isLoggedIn) {
      addGuestFavourite(id);
      dispatch(setFavouritesProductIds([...favouritesProductIds, id]));
      return;
    }
    try {
      await api.post("favourites/add", {
        productId: id,
        userId,
      });
      dispatch(setFavouritesProductIds([...favouritesProductIds, id]));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteProfromFavourites = async () => {
    if (!isLoggedIn) {
      removeGuestFavourite(id);
      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((item) => item !== id),
        ),
      );
      return;
    }
    try {
      await api.post("favourites/delete", {
        productId: id,
        userId,
      });

      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((item) => item !== id),
        ),
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-xl">
      <div className="relative flex h-36 items-center justify-center bg-zinc-900 p- sm:h-45 sm:p-5">
        <img
          src={image?.[0]}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-0 "
        />
        <img
          src={image?.[1]}
          alt={name}
          className="absolute left-0 top-0 h-full w-full object-contain p-3 opacity-0 transition duration-300 group-hover:scale-105 group-hover:opacity-100 sm:p-5"
        />
      </div>

      {/* Every block below is its own row: name, then rating, then price, then the buttons row */}
      <div className="flex flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
        <p className="w-full truncate text-sm font-semibold text-white sm:text-base">
          {name}
        </p>

        {/* {ratingAvg > 0 && (
          <div className="flex items-center gap-1">
            <p className="mr-1 text-xs font-bold text-zinc-300 sm:text-sm">
              {ratingCount}
            </p>
            <Rating value={ratingAvg} onChange={() => {}} interactive={false} />
          </div>
        )} */}

        <div className="flex items-center justify-between gap-2">
          {discountPrice ? (
            <>
              <p className="text-xs font-semibold text-amber-400 line-through sm:text-sm">
                ج.م.{price}
              </p>
              <p className="text-sm font-semibold text-amber-400 sm:text-base">
                ج.م.{discountPrice}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-amber-400 sm:text-base">
              ج.م.{price}
            </p>
          )}
          {forShow && (
            <>
              {" "}
              <div className="flex px-2 py-1 items-center justify-between rounded-full bg-zinc-200">
                <span className="flex-1 text-center text-xs font-bold text-zinc-800 sm:text-sm">
                  {count}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Buttons row: cart control grows to fill the space, favourite stays fixed size next to it */}

        {!forShow &&
          (role == "admin" ? (
            <>
              {" "}
              <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                <Link
                  to={`/edit_product/${id}`}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 flex items-center justify-center gap-2 flex-1 "
                >
                  <Edit /> Edit
                </Link>
                <button
                  type="button"
                  className="rounded-full bg-red-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 "
                  onClick={() => deleteProduct()}
                >
                  <Trash9 />
                </button>
              </div>
            </>
          ) : (
            <div
              onClick={(e) => e.preventDefault()}
              className="flex w-full items-center gap-1 justify-center"
            >
              {cartData.isinCart ? (
                <div className="flex h-10 flex-1 items-center justify-between rounded-full bg-zinc-200 px-1">
                  {cartData.count <= 1 ? (
                    <button
                      className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-zinc-800 transition hover:bg-zinc-300 active:scale-95"
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => deleteProfromCart()}
                    >
                      <Trash9 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-zinc-800 transition hover:bg-zinc-300 active:scale-95"
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => editCountCart("decrease")}
                    >
                      <svg
                        className="h-3.5 w-3.5"
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

                  <span className="flex-1 text-center text-xs font-bold text-zinc-800 sm:text-sm">
                    {cartData.count}
                  </span>

                  <button
                    disabled={cartData.count >= stock}
                    className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-zinc-800 transition hover:bg-zinc-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100"
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => editCountCart("increase")}
                  >
                    <svg
                      className="h-3.5 w-3.5"
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
                <button
                  type="button"
                  aria-label={`Add ${name} to cart`}
                  disabled={stock <= 0}
                  className="flex h-10 flex-1 touch-manipulation cursor-pointer items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-200 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 active:scale-95 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-zinc-500 disabled:text-zinc-300 disabled:opacity-60 disabled:hover:bg-zinc-500 disabled:active:scale-100 sm:text-sm"
                  onClick={addtoCart}
                >
                  <CartAdd2 />
                  {stock <= 0 ? "غير متوفر" : "أضف إلى السلة"}
                </button>
              )}

              {isFavourite ? (
                <button
                  type="button"
                  aria-label={`favourtie ${name}`}
                  className="flex h-10 w-10 shrink-0 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                  onClick={deleteProfromFavourites}
                >
                  <HeartSlash />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label={`favourtie ${name}`}
                  className="flex h-10 w-10 shrink-0 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                  onClick={addtoFavourites}
                >
                  <Heart5 />
                </button>
              )}
            </div>
          ))}

        {/* <div onClick={(event) => event.preventDefault()} className="w-full">
          <WhatsAppButton
            message={productWhatsAppMessage({
              name,
              price: discountPrice || price,
              image: image?.[0],
            })}
            className="w-full rounded-full"
          >
           
          </WhatsAppButton>
        </div> */}
      </div>
    </div>
  );
}
