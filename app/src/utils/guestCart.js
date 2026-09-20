// utils/guestCart.js
//
// تخزين مؤقت في المتصفح (localStorage) للسلة والمفضلة لحد ما اليوزر يسجل دخول.
// بعد تسجيل الدخول، ناديلك على syncGuestDataToServer مرة واحدة بس عشان
// تبعت اللي اتخزن للسيرفر وتمسحه من المتصفح.

import api from "../components/api"; // TODO: عدّل المسار ده لمكان ملف الـ api عندك لو مختلف
import { setCartCount, setFavouritesProductIds } from "../Redux/pageSlice"; // TODO: عدّل المسار لو مختلف

const GUEST_CART_KEY = "guest_cart"; // { [productId]: count }
const GUEST_FAVOURITES_KEY = "guest_favourites"; // [productId, ...]

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
    console.error(`Error writing ${key}:`, error);
  }
};

export const getGuestCart = () => readJSON(GUEST_CART_KEY, {});
export const getGuestCartItem = (productId) =>
  getGuestCart()[productId] ?? null;

export const setGuestCartItem = (productId, count) => {
  const cart = getGuestCart();
  cart[productId] = count || 1;
  writeJSON(GUEST_CART_KEY, cart);
};

export const removeGuestCartItem = (productId) => {
  const cart = getGuestCart();
  delete cart[productId];
  writeJSON(GUEST_CART_KEY, cart);
};

export const getGuestFavourites = () => readJSON(GUEST_FAVOURITES_KEY, []);
export const isGuestFavourite = (productId) =>
  getGuestFavourites().includes(productId);

export const addGuestFavourite = (productId) => {
  const favourites = getGuestFavourites();
  if (!favourites.includes(productId)) {
    writeJSON(GUEST_FAVOURITES_KEY, [...favourites, productId]);
  }
};

export const removeGuestFavourite = (productId) => {
  writeJSON(
    GUEST_FAVOURITES_KEY,
    getGuestFavourites().filter((pid) => pid !== productId),
  );
};

const clearGuestData = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_FAVOURITES_KEY);
};

// نادي عليها مرة واحدة بس بعد ما اليوزر يسجل دخول بنجاح، مثلاً:
//
//   useEffect(() => {
//     if (userId) syncGuestDataToServer(userId, dispatch);
//   }, [userId]);
//
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

  // الأفضل بعد كده تجيب عدد السلة والمفضلة الحقيقيين من السيرفر
  // بدل ما تحسبهم بنفسك، عشان تتجنب أي فرق لو كان عند اليوزر حاجات متسجلة قبل كده:
  //
  // const { data } = await api.get(`cart/${userId}`);
  // dispatch(setCartCount(data.count));
}
