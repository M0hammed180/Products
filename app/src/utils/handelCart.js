// useCartFavourites.js
//
// Cart & Favourites logic with guest (not-logged-in) support.
// - If userId is missing => actions are stored in localStorage ("guest mode").
// - Once the user logs in => call syncGuestDataToServer(userId, dispatch) ONCE
//   to push the local items to the backend and clear localStorage.
//
// Adjust the import paths below (api instance, redux slice actions/selectors)
// to match your actual project structure.

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../components/api"; // TODO: عدّل المسار لملف الـ axios instance عندك
import { setCartCount, setFavouritesProductIds } from "../Redux/pageSlice";

const GUEST_CART_KEY = "guest_cart"; // { [productId]: count }
const GUEST_FAVOURITES_KEY = "guest_favourites"; // [productId, ...]

/* ---------------- Guest (localStorage) helpers ---------------- */

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const getGuestCart = () => readJSON(GUEST_CART_KEY, {});
export const getGuestFavourites = () => readJSON(GUEST_FAVOURITES_KEY, []);

const setGuestCartItem = (productId, count) => {
  const cart = getGuestCart();
  cart[productId] = count;
  writeJSON(GUEST_CART_KEY, cart);
};

const removeGuestCartItem = (productId) => {
  const cart = getGuestCart();
  delete cart[productId];
  writeJSON(GUEST_CART_KEY, cart);
};

const addGuestFavourite = (productId) => {
  const favourites = getGuestFavourites();
  if (!favourites.includes(productId)) {
    writeJSON(GUEST_FAVOURITES_KEY, [...favourites, productId]);
  }
};

const removeGuestFavourite = (productId) => {
  writeJSON(
    GUEST_FAVOURITES_KEY,
    getGuestFavourites().filter((pid) => pid !== productId),
  );
};

const clearGuestData = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_FAVOURITES_KEY);
};

/* ---------------- Hook used inside the product component ---------------- */

export function useCartFavourites(
  id,
  count,
  initialCartData = { count: 1, isinCart: false },
) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId); // TODO: عدّل حسب مكان الـ userId في الـ store
  const cartCount = useSelector((state) => state.cart.cartCount);
  const favouritesProductIds = useSelector(
    (state) => state.favourites.productIds,
  );

  const isLoggedIn = Boolean(userId);

  const [cartData, setCartData] = useState(() => {
    if (isLoggedIn) return initialCartData;
    const guestCart = getGuestCart();
    return guestCart[id] != null
      ? { count: guestCart[id], isinCart: true }
      : initialCartData;
  });

  const addtoCart = useCallback(async () => {
    if (!isLoggedIn) {
      setGuestCartItem(id, count);
      setCartData({ count, isinCart: true });
      dispatch(setCartCount(cartCount + 1));
      return;
    }
    try {
      await api.post("cart/add", { productId: id, userId, count });
      setCartData({ count, isinCart: true });
      dispatch(setCartCount(cartCount + 1));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [id, userId, isLoggedIn, count, cartCount, dispatch]);

  const editCountCart = useCallback(
    async (type) => {
      if (!isLoggedIn) {
        setCartData((prev) => {
          const newCount =
            type === "increase" ? prev.count + 1 : prev.count - 1;
          setGuestCartItem(id, newCount);
          return { ...prev, count: newCount };
        });
        return;
      }
      try {
        await api.post("cart/edit", { productId: id, userId, type });
        setCartData((prev) => ({
          ...prev,
          count: type === "increase" ? prev.count + 1 : prev.count - 1,
        }));
      } catch (error) {
        console.error("Error editing cart count:", error);
      }
    },
    [id, userId, isLoggedIn],
  );

  const deleteProfromCart = useCallback(async () => {
    if (!isLoggedIn) {
      removeGuestCartItem(id);
      setCartData((prev) => ({ ...prev, isinCart: false }));
      dispatch(setCartCount(cartCount - 1));
      return;
    }
    try {
      await api.post("cart/delete", { productId: id, userId });
      setCartData((prev) => ({ ...prev, isinCart: false }));
      dispatch(setCartCount(cartCount - 1));
    } catch (error) {
      console.error("Error deleting from cart:", error);
    }
  }, [id, userId, isLoggedIn, cartCount, dispatch]);

  const addtoFavourites = useCallback(async () => {
    if (!isLoggedIn) {
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
  }, [id, userId, isLoggedIn, favouritesProductIds, dispatch]);

  const deleteProfromFavourites = useCallback(async () => {
    if (!isLoggedIn) {
      removeGuestFavourite(id);
      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((pid) => pid !== id),
        ),
      );
      return;
    }
    try {
      await api.post("favourites/delete", { productId: id, userId });
      dispatch(
        setFavouritesProductIds(
          favouritesProductIds.filter((pid) => pid !== id),
        ),
      );
    } catch (error) {
      console.error("Error removing product from favourites:", error);
    }
  }, [id, userId, isLoggedIn, favouritesProductIds, dispatch]);

  return {
    cartData,
    setCartData,
    addtoCart,
    editCountCart,
    deleteProfromCart,
    addtoFavourites,
    deleteProfromFavourites,
  };
}

/* ---------------- Sync guest data to the server after login ---------------- */
//
// استدعِ الدالة دي مرة واحدة بعد نجاح تسجيل الدخول (مثلاً في صفحة اللوجين
// أو في useEffect بيراقب userId في App.jsx):
//
//   useEffect(() => {
//     if (userId) syncGuestDataToServer(userId, dispatch);
//   }, [userId]);

export async function syncGuestDataToServer(userId, dispatch) {
  const guestCart = getGuestCart();
  const guestFavourites = getGuestFavourites();

  await Promise.all(
    Object.entries(guestCart).map(([productId, count]) =>
      api.post("cart/add", { productId, userId, count }).catch((error) => {
        console.error(`Error syncing cart item ${productId}:`, error);
      }),
    ),
  );

  await Promise.all(
    guestFavourites.map((productId) =>
      api.post("favourites/add", { productId, userId }).catch((error) => {
        console.error(`Error syncing favourite ${productId}:`, error);
      }),
    ),
  );

  clearGuestData();

  // الأفضل بعد المزامنة إنك تجيب العدد والقوائم الفعلية من السيرفر
  // (مش تحسبها محليًا) عشان تتجنب فروقات لو كان عند اليوزر عناصر متسجلة قبل كده:
  // const { data } = await api.get(`cart/${userId}`);
  // dispatch(setCartCount(data.count));
  // const { data: favs } = await api.get(`favourites/${userId}`);
  // dispatch(setFavouritesProductIds(favs.productIds));
}
