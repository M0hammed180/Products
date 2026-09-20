import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/userSlice";
import {
  Add,
  AddCircle,
  Additem,
  Bag2,
  Category,
  ForwardItem,
  ForwardItem2,
  Heart5,
  HeartCircle3,
  Home2,
  Login6,
  Logout6,
  Profile2user,
  ReceiptItem,
  ReceiptText,
  SearchNormal2,
  ShoppingCart,
  SidebarBottom,
  SidebarTop,
  User4,
  UserAdd4,
} from "reicon-react";
import {
  setCartCount,
  setCartProductIds,
  setCategoty,
  setFavouritesProductIds,
  setSearch,
  setSearchOrder,
} from "../../Redux/pageSlice";
import api from "../api";
import { getGuestCart, getGuestFavourites } from "../../utils/guestCart";
import { FaHome } from "react-icons/fa";

const homeCategories = ["tshirts", "pantalons", "shoes"];
const categoryLabels = {
  tshirts: "تيشيرتات",
  pantalons: "بناطيل",
  shoes: "أحذية",
};

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState(false);
  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const { role, isAuthenticated, avatar, userName, userId } = useSelector(
    (state) => state.user,
  );
  const { search, category, searchOrder, cartCount } = useSelector(
    (state) => state.page,
  );
  const isSidebarLinkActive = (path) => location.pathname === path;
  const userNavLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-white transition-colors flex items-center gap-2 ${
      location.pathname === path
        ? "bg-white/20 text-amber-300"
        : "hover:bg-white/10 hover:text-amber-200"
    }`;
  const userNavCategoryClass = `flex items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
    isDropdownOpen
      ? "bg-white/20 text-amber-300"
      : "text-white hover:bg-white/10 hover:text-amber-200"
  }`;

  // Initialize theme on mount
  useEffect(() => {
    const isDark =
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Click-away listener for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      const insideMobile = mobileDropdownRef.current?.contains(event.target);

      const insideDesktop = desktopDropdownRef.current?.contains(event.target);

      if (!insideMobile && !insideDesktop) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll while the mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  //logout
  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };
  //cartCount
  const fetchUserCart = async () => {
    try {
      if (userId) {
        const response = await api.get(`cart/mycart/${userId}`);

        if (response.data.myCart) {
          const ids = response.data.myCart.products.map((item) => item);
          dispatch(setCartProductIds(ids));
          dispatch(setCartCount(ids?.length));
          console.log(ids);
        }
      } else {
        const guestCart = getGuestCart();
        const productIds = Object.keys(guestCart);

        if (productIds.length === 0) {
          return;
        }
        dispatch(setCartProductIds(productIds));
        dispatch(setCartCount(productIds?.length));
      }
    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };
  //favourites
  const fetchUserFavourites = async () => {
    try {
      if (userId) {
        const response = await api.get(`favourites/myfavourites/${userId}`);

        if (response.data.myFavourites) {
          const ids = response.data.myFavourites.products.map((item) => item);
          dispatch(setFavouritesProductIds(ids));
          console.log(ids);
        }
      } else {
        const guestFavourites = getGuestFavourites();

        if (guestFavourites.length === 0) {
          return;
        }
        dispatch(setFavouritesProductIds(guestFavourites));
      }
    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };
  useEffect(() => {
    fetchUserCart();
    fetchUserFavourites();
  }, []);
  return (
    <>
      {role == "admin" ? (
        <>
          <nav className="fixed left-0 top-0 z-30 w-full border-b border-zinc-200/70 bg-white/70 backdrop-blur-md dark:border-zinc-700/70 dark:bg-zinc-900">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <button
                    id="toggleSidebarMobile"
                    aria-expanded={isSidebarOpen}
                    aria-controls="sidebar"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden mr-2 text-zinc-600 hover:text-zinc-900 cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:bg-zinc-100 focus:ring-2 focus:ring-zinc-100 rounded"
                  >
                    <svg
                      id="toggleSidebarMobileHamburger"
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      id="toggleSidebarMobileClose"
                      className="w-6 h-6 hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <Link
                    to="/"
                    className="text-xl font-bold flex items-center dark:text-white text-zinc-900 lg:ml-2.5"
                  >
                    <span className="self-center whitespace-nowrap">شياكة</span>
                  </Link>
                  {(location.pathname === "/products_admin" ||
                    location.pathname === "/users" ||
                    location.pathname === "/orders") && (
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="hidden lg:flex lg:pl-32 lg:gap-3 lg:items-center "
                    >
                      <label htmlFor="topbar-search" className="sr-only">
                        Search
                      </label>
                      <div className="mt-1 relative lg:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-zinc-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="search"
                          id="topbar-search"
                          className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 pl-10 dark:text-white text-zinc-900 focus:border-amber-600 focus:ring-amber-600 dark:border-zinc-600 dark:bg-zinc-900  sm:text-sm"
                          placeholder="بحث"
                          onChange={(e) => {
                            dispatch(setSearch(e.target.value));
                            e.target.value === "" &&
                              dispatch(setSearchOrder(!searchOrder));
                          }}
                        />
                      </div>
                      {location.pathname === "/products_admin" ? (
                        <select
                          value={category}
                          onChange={(e) =>
                            dispatch(setCategoty(e.target.value))
                          }
                          className="rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                        >
                          <option value="">كل الأقسام</option>
                          <option value="tshirts">تيشيرتات</option>
                          <option value="pantalons">بناطيل</option>
                          <option value="shoes">أحذية</option>
                        </select>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatch(setSearchOrder(!searchOrder))}
                          className="rounded-full bg-white p-3  text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                        >
                          <SearchNormal2 />
                        </button>
                      )}
                    </form>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    id="toggleSidebarMobileSearch"
                    type="button"
                    className="lg:hidden text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700 p-2 rounded-lg"
                  >
                    <span className="sr-only">Search</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={logOut}
                    className="px-4 py-2 mt-2 text-sm font-semibold bg-red-600 text-white rounded-full dark:bg-red-900 dark:hover:bg-red-800 md:mt-0 md:ml-4 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 focus:shadow-outline"
                    to="/"
                  >
                    تسجيل الخروج
                  </button>
                  {/* Theme Toggle Button */}
                  <button
                    id="theme-toggle"
                    type="button"
                    onClick={toggleTheme}
                    className="text-zinc-500 bg-zinc-200 dark:text-zinc-400 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 rounded-full text-sm p-2.5 md:ml-5 not-md:hidden "
                  >
                    {/* Dark Icon (Moon) - Shows when currently in light mode */}
                    <svg
                      id="theme-toggle-dark-icon"
                      className={`w-5 h-5 ${isDarkMode ? "hidden" : "block"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>

                    {/* Light Icon (Sun) - Shows when currently in dark mode */}
                    <svg
                      id="theme-toggle-light-icon"
                      className={`w-5 h-5 ${isDarkMode ? "block" : "hidden"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <div className="h-16" aria-hidden="true" />
          <aside
            id="sidebar"
            className={`fixed right-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-l border-zinc-200/70 bg-white/80 text-right backdrop-blur-md transition-transform duration-200 dark:border-zinc-700/70 dark:bg-zinc-900 ${isSidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"} lg:translate-x-0 lg:pointer-events-auto`}
            aria-label="القائمة الجانبية"
          >
            <div className="relative flex min-h-0 flex-1 flex-col bg-transparent pt-0">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 space-y-1 divide-y bg-transparent px-3 dark:divide-zinc-700">
                  <ul className="space-y-2 pb-2">
                    <li>
                      <Link
                        to="/"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <Home2 />
                        <span className="mr-3">لوحة التحكم</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/add_product"
                        rel="noreferrer"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/add_product")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <Additem />
                        <span className="mr-3 flex-1 whitespace-nowrap">
                          Add Product
                        </span>
                      </Link>
                    </li>
                    {/* <li>
                        <Link
                          to="/add_category"
                          rel="noreferrer"
                          className="text-base dark:text-white text-zinc-900 font-normal rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center p-2 group"
                        >
                          <AddCircle />
                          <span className="mr-3 flex-1 whitespace-nowrap">
                            Add Category
                          </span>
                        </Link>
                      </li> */}
                    <li>
                      <Link
                        to="/add_user"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/add_user")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <UserAdd4 />
                        <span className="mr-3 flex-1 whitespace-nowrap">
                          Add User
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/users"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/users")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <Profile2user />{" "}
                        <span className="mr-3 flex-1 whitespace-nowrap">
                          Users
                        </span>
                      </Link>
                    </li>
                    {/* <li>
                        <Link
                          to="/categorys_admin"
                          className="text-base dark:text-white text-zinc-900 font-normal rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center p-2 group"
                        >
                          <Category />
                          <span className="mr-3 flex-1 whitespace-nowrap">
                            Categorys
                          </span>
                        </Link>
                      </li> */}
                    <li>
                      <Link
                        to="/products_admin"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/products_admin")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <ForwardItem />
                        <span className="mr-3 flex-1 whitespace-nowrap">
                          Products
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className={`group flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                          isSidebarLinkActive("/orders")
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <ReceiptItem />{" "}
                        <span className="mr-3 flex-1 whitespace-nowrap">
                          الطلبات
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : (
        <>
          <nav className="fixed top-0 left-0 z-100 w-full md:px-6 px-3  backdrop-blur-md bg-zinc-800/80">
            <div className="md:mx-auto md:max-w-7xl rounded-fulll  md:px-6 py-3 ">
              <div className="flex items-center justify-between gap-2">
                {/* Mobile: opens the right-hand sidebar */}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  aria-controls="mobile-sidebar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm md:hidden"
                >
                  {isOpen ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>

                {/* Logo */}
                <Link
                  to="/"
                  className="text-2xl font-bold tracking-tight text-white not-md:hidden"
                >
                  شياكة
                </Link>
                {/* mobile */}
                {location.pathname == "/products" ? (
                  <div className="flex min-w-0 flex-1 gap-3 rounded-full bg-zinc-200/30 p-1 md:flex-none md:hidden">
                    {" "}
                    {/* Search */}
                    <div className="flex w-full min-w-0 items-center rounded-full bg-white/20 px-3 backdrop-blur-sm md:w-52">
                      <input
                        type="search"
                        name="search"
                        placeholder="بحث..."
                        className="w-full bg-transparent px-2 py-1 text-base text-white outline-none placeholder:text-white/60 not-md:placeholder:text-sm "
                        onChange={(e) => {
                          dispatch(setSearch(e.target.value));
                          e.target.value === "" &&
                            dispatch(setSearchOrder(!searchOrder));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            dispatch(setSearchOrder(!searchOrder));
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`relative z-10000 flex items-center gap-1 rounded-full md:px-3 md:py-2 transition-colors ${"text-white hover:bg-white/10 hover:text-amber-200 capitalize"}`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 56.966 56.966"
                        >
                          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                      </button>
                    </div>
                    {/* Category Dropdown */}
                    <div
                      className="relative z-9999 shrink-0 flex items-center justify-center"
                      ref={mobileDropdownRef}
                    >
                      {/* Category Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`flex items-center gap-1 rounded-full md:px-3 md:py-2 transition-colors ${
                            isDropdownOpen
                              ? "bg-white/20 text-amber-300 capitalize"
                              : "text-white hover:bg-white/10 hover:text-amber-200 capitalize"
                          }`}
                        >
                          <Category />
                          <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                          <div
                            className="absolute left-0 top-full mt-5 w-40 text-right md:w-80"
                            dir="rtl"
                          >
                            <div className="rounded-2xl border border-white/15 bg-zinc-800 p-3 shadow-xl ">
                              <div className="grid grid-cols-1 gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(setCategoty(""));
                                    setIsDropdownOpen(false);
                                  }}
                                  className="rounded-xl p-2 text-right text-zinc-800 transition hover:bg-amber-400/20"
                                >
                                  <p className="font-semibold text-white">
                                    الكل
                                  </p>
                                </button>
                                {homeCategories.map((category) => (
                                  <button
                                    key={category}
                                    onClick={() => {
                                      dispatch(setCategoty(category));
                                      setIsDropdownOpen(false);
                                    }}
                                    className="rounded-xl p-2 text-right text-zinc-800 transition hover:bg-amber-400/20"
                                  >
                                    <p className="font-semibold text-white">
                                      {categoryLabels[category]}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-white md:hidden"
                  >
                    شياكة
                  </Link>
                )}
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex">
                  <Link to="/" className={userNavLinkClass("/")}>
                    Home
                  </Link>

                  {location.pathname == "/products" ? (
                    <div className="bg-zinc-200/30 rounded-full p-1 flex gap-3 ">
                      {" "}
                      {/* Search */}
                      <div className="flex w-52 items-center rounded-full bg-white/20 px-3 backdrop-blur-sm">
                        <input
                          type="search"
                          name="search"
                          placeholder="بحث..."
                          className="w-full bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/60"
                          onChange={(e) => {
                            dispatch(setSearch(e.target.value));
                            e.target.value === "" &&
                              dispatch(setSearchOrder(!searchOrder));
                          }}
                        />

                        <button
                          type="button"
                          className="text-white transition hover:text-white/60 cursor-pointer"
                          onClick={() => dispatch(setSearchOrder(!searchOrder))}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 56.966 56.966"
                          >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                          </svg>
                        </button>
                      </div>
                      {/* Category Dropdown */}
                      <div className="relative" ref={desktopDropdownRef}>
                        {" "}
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`flex items-center gap-1 rounded-full px-3 py-2 transition-colors ${
                            isDropdownOpen
                              ? "bg-white/20 text-amber-300 capitalize"
                              : "text-white hover:bg-white/10 hover:text-amber-200 capitalize"
                          }`}
                        >
                          {category === "" ? "الكل" : categoryLabels[category]}
                          <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* Dropdown */}
                        {isDropdownOpen && (
                          <div
                            className="absolute right-0 top-full mt-4 w-80 text-right"
                            dir="rtl"
                          >
                            <div className="rounded-2xl border border-white/15 bg-zinc-800 p-3 shadow-xl ">
                              <div className="grid grid-cols-1 gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(setCategoty(""));
                                    setIsDropdownOpen(false);
                                  }}
                                  className="rounded-xl p-2 text-right text-zinc-800 transition hover:bg-amber-400/20"
                                >
                                  <p className="font-semibold text-white">
                                    الكل
                                  </p>
                                </button>
                                {homeCategories.map((category) => (
                                  <button
                                    key={category}
                                    onClick={() => {
                                      dispatch(setCategoty(category));
                                      setIsDropdownOpen(false);
                                    }}
                                    className="rounded-xl p-2 text-right text-zinc-800 transition hover:bg-amber-400/20"
                                  >
                                    <p className="font-semibold text-white">
                                      {categoryLabels[category]}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Product */}
                      <Link
                        to="/products"
                        onClick={() => dispatch(setCategoty(""))}
                        className={userNavLinkClass("/products")}
                      >
                        المنتجات
                      </Link>{" "}
                    </>
                  )}

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className={
                      userNavLinkClass("/cart") +
                      " flex items-center justify-center w-10 h-8"
                    }
                  >
                    <div className="absolute ">
                      <ShoppingCart size={30} />
                      <span className=" absolute -top-1 -right-1 rounded-full px-1 py-[0.5px] text-white bg-amber-800 text-[10px] font-bold">
                        {cartCount}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setProfile(!profile)}
                    className="rounded-full  px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-200/50"
                  >
                    {profile ? <SidebarTop /> : <SidebarBottom />}
                  </button>

                  {profile && (
                    <div className="absolute left-0 top-full mt-4 w-80 max-w-[calc(100vw-1.5rem)]">
                      <div className="rounded-2xl border border-white/15 bg-zinc-800 p-3 shadow-xl ">
                        <div className="grid grid-cols-1 gap-2 ">
                          {userId && (
                            <>
                              {" "}
                              <Link
                                to="/edit_profile"
                                className="rounded-xl p-2 text-zinc-800 transition hover:bg-amber-400/20 flex gap-2 items-center"
                                onClick={() => setProfile(false)}
                              >
                                <img
                                  src={avatar}
                                  className="h-10 w-10 rounded-full"
                                />
                                <p className="font-semibold text-sm text-white uppercase">
                                  {userName}
                                </p>
                              </Link>
                              {/* Orders */}
                              <Link
                                to="/orders"
                                className={
                                  userNavLinkClass("/orders") +
                                  " flex items-center gap-2"
                                }
                                onClick={() => setProfile(false)}
                              >
                                <ReceiptItem />
                                طلباتي
                              </Link>
                            </>
                          )}

                          {/* Favourites */}
                          <Link
                            to="/fav"
                            className={
                              userNavLinkClass("/fav") +
                              " flex items-center gap-2"
                            }
                            onClick={() => setProfile(false)}
                          >
                            <HeartCircle3 /> المفضلة
                          </Link>
                          {userId ? (
                            <>
                              {/* Logout */}
                              <button
                                onClick={() => {
                                  logOut();
                                  setProfile(false);
                                }}
                                className="rounded-full  px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 bg-red-950"
                              >
                                تسجيل الخروج
                              </button>
                            </>
                          ) : (
                            <>
                              {" "}
                              <Link
                                to="/login"
                                className={userNavLinkClass("/login")}
                                onClick={() => setProfile(false)}
                              >
                                <Login6 /> تسجيل دخول
                              </Link>{" "}
                              <Link
                                to="/register"
                                className={userNavLinkClass("/register")}
                                onClick={() => setProfile(false)}
                              >
                                <UserAdd4 /> انشاء حساب
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Theme Toggle */}
                </div>

                {/* Mobile: cart is always visible, on the far right */}
                <Link
                  to="/cart"
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                  <span className="absolute -right-1 -top-1 rounded-full bg-amber-800 px-1 py-[0.5px] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile sidebar backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden ${
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          {/* Mobile sidebar (slides in from the right) */}
          <aside
            id="mobile-sidebar"
            aria-label="Menu"
            className={`fixed right-0 top-0 z-200 flex h-full w-72 max-w-[80%] flex-col bg-zinc-900 text-right shadow-xl transition-transform duration-300 md:hidden ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold tracking-tight text-white"
              >
                شياكة
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-1 text-white hover:bg-white/10"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              <Link
                to="/"
                className={userNavLinkClass("/")}
                onClick={() => setIsOpen(false)}
              >
                <Home2 /> الرئيسية
              </Link>
              <Link
                to="/products"
                className={userNavLinkClass("/products")}
                onClick={() => {
                  dispatch(setCategoty(""));
                  setIsOpen(false);
                }}
              >
                <ForwardItem2 /> المنتجات
              </Link>
              <Link
                to="/fav"
                className={userNavLinkClass("/fav")}
                onClick={() => setIsOpen(false)}
              >
                <Heart5 /> المفضلة
              </Link>
              {userId ? (
                <>
                  {" "}
                  <Link
                    to="/orders"
                    className={userNavLinkClass("/orders")}
                    onClick={() => setIsOpen(false)}
                  >
                    <ReceiptText /> طلباتي
                  </Link>
                  <Link
                    to="/edit_profile"
                    className="mt-2 flex items-center gap-2 rounded-lg p-2 text-white transition hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <img src={avatar} className="h-10 w-10 rounded-full" />
                    <p className="text-sm font-semibold uppercase">
                      {userName}
                    </p>
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  <Link
                    to="/login"
                    className={userNavLinkClass("/login")}
                    onClick={() => setIsOpen(false)}
                  >
                    <Login6 /> تسجيل دخول
                  </Link>{" "}
                  <Link
                    to="/register"
                    className={userNavLinkClass("/register")}
                    onClick={() => setIsOpen(false)}
                  >
                    <UserAdd4 /> انشاء حساب
                  </Link>
                </>
              )}
            </div>
            {userId && (
              <div className="border-t border-white/10 p-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logOut();
                  }}
                  className="w-full rounded-full bg-red-500/80 px-4 py-3 text-white transition hover:bg-red-600 flex items-center gap-2 justify-center"
                >
                  <Logout6 /> Logout
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}
