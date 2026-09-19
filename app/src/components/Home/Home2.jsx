import React, { useEffect, useState } from "react";
import api from "../api";

export default function Home() {
  const [categorys, setCategorys] = useState([]);
  //fetchCatogry
  useEffect(() => {
    const fetchCatogry = async () => {
      try {
        const response = await api.get("category");
        setCategorys(response.data.categorys);
        console.log(response.data.categorys);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCatogry();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          type="button"
          onClick={toggleTheme}
          className="rounded-full bg-white/20 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          {/* Moon */}
          <svg
            className={`h-5 w-5 ${isDarkMode ? "hidden" : "block"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>

          {/* Sun */}
          <svg
            className={`h-5 w-5 ${isDarkMode ? "block" : "hidden"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            />
          </svg>
        </button>
        <main className="my-8">
          <div className="container mx-auto px-6">
            <div
              className={`h-64 bg-[url('${categorys[0]?.image}')] rounded-md overflow-hidden bg-cover bg-center `}
              style={{ backgroundImage: `url(${categorys[0]?.image})` }}
            >
              <div className="bg-zinc-900/60 bg-opacity-50 flex items-center h-full">
                <div className="px-10 max-w-xl">
                  <h2 className="text-2xl text-white font-semibold">
                    {categorys[0]?.name}
                  </h2>
                  <p className="mt-2 text-zinc-400">
                    {categorys[0]?.description}{" "}
                  </p>
                  <button className="flex items-center mt-4 px-3 py-2 bg-zinc-600/50 backdrop-blur-md text-white text-sm uppercase font-medium rounded hover:bg-zinc-500/50 focus:outline-none focus:bg-zinc-500/50">
                    <span>Shop Now</span>
                    <svg
                      className="h-5 w-5 mx-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="md:flex mt-8 md:-mx-4">
              <div
                className="w-full h-64 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:w-1/2"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80')",
                }}
              >
                <div className="bg-zinc-900/60 bg-opacity-50 flex items-center h-full">
                  <div className="px-10 max-w-xl">
                    <h2 className="text-2xl text-white font-semibold">
                      Back Pack
                    </h2>
                    <p className="mt-2 text-zinc-400">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Tempore facere provident molestias ipsam sint voluptatum
                      pariatur.
                    </p>
                    <button className="flex items-center mt-4 px-3 py-2 bg-zinc-600/50 backdrop-blur-md text-white text-sm uppercase font-medium rounded hover:bg-zinc-500/50 focus:outline-none focus:bg-zinc-500/50">
                      <span>Shop Now</span>
                      <svg
                        className="h-5 w-5 mx-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="w-full h-64 mt-8 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:mt-0 md:w-1/2"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')",
                }}
              >
                <div className="bg-zinc-900/60 bg-opacity-50 flex items-center h-full">
                  <div className="px-10 max-w-xl">
                    <h2 className="text-2xl text-white font-semibold">Games</h2>
                    <p className="mt-2 text-zinc-400">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Tempore facere provident molestias ipsam sint voluptatum
                      pariatur.
                    </p>
                    <button className="flex items-center mt-4 px-3 py-2 bg-zinc-600/50 backdrop-blur-md text-white text-sm uppercase font-medium rounded hover:bg-zinc-500/50 focus:outline-none focus:bg-zinc-500/50">
                      <span>Shop Now</span>
                      <svg
                        className="h-5 w-5 mx-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fashions Section 1 */}
            <div className="mt-16">
              <h3 className="text-2xl font-medium text-zinc-700 dark:text-zinc-100">
                Fashions
              </h3>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {[
                  {
                    name: "Chanel",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80",
                  },
                  {
                    name: "Man Mix",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
                  },
                  {
                    name: "Classic watch",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
                  },
                  {
                    name: "woman mix",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="mx-auto w-full max-w-sm overflow-hidden rounded-md bg-white shadow-md dark:bg-zinc-800"
                  >
                    <div
                      className="flex items-end justify-end h-56 w-full bg-cover"
                      style={{ backgroundImage: `url('${item.img}')` }}
                    >
                      <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="px-5 py-3">
                      <h3 className="uppercase text-zinc-700 dark:text-zinc-100">
                        {item.name}
                      </h3>
                      <span className="mt-2 text-zinc-500 dark:text-zinc-400">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fashions Section 2 */}
            <div className="mt-16">
              <h3 className="text-2xl font-medium text-zinc-700 dark:text-zinc-100">
                Fashions
              </h3>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {[
                  {
                    name: "Chanel",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80",
                  },
                  {
                    name: "Man Mix",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
                  },
                  {
                    name: "Classic watch",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
                  },
                  {
                    name: "woman mix",
                    price: "$12",
                    img: "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80",
                  },
                ].map((item, index) => (
                  <div
                    key={`dup-${index}`}
                    className="mx-auto w-full max-w-sm overflow-hidden rounded-md bg-white shadow-md dark:bg-zinc-800"
                  >
                    <div
                      className="flex items-end justify-end h-56 w-full bg-cover"
                      style={{ backgroundImage: `url('${item.img}')` }}
                    >
                      <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="px-5 py-3">
                      <h3 className="uppercase text-zinc-700 dark:text-zinc-100">
                        {item.name}
                      </h3>
                      <span className="mt-2 text-zinc-500 dark:text-zinc-400">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-zinc-200 dark:bg-zinc-800">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <a
              href="#"
              className="text-xl font-bold text-zinc-500 hover:text-zinc-400 dark:text-zinc-200"
            >
              Brand
            </a>
            <p className="py-2 text-zinc-500 dark:text-zinc-400 sm:py-0">
              All rights reserved
            </p>
          </div>
        </footer>
        <div className="rounded-3xl   bg-neutral-secondary-medium p-2">
          <div className="mb-2 grid grid-cols-3 gap-2">
            {/* To Do */}
            <dl className="flex h-17 flex-col items-center justify-center rounded-2xl border border-brand-subtle bg-brand-softer text-fg-brand-strong">
              <dt className="w-8 h-8 rounded-full bg-brand-soft text-fg-brand-strong text-sm font-medium flex items-center justify-center mb-1">
                12
              </dt>

              <dd className="text-fg-brand text-sm font-medium">To do</dd>
            </dl>

            {/* In Progress */}
            <dl className="flex h-17 flex-col items-center justify-center rounded-2xl border border-warning-subtle bg-warning-soft text-fg-warning">
              <dt className="w-8 h-8 rounded-full bg-warning-medium text-fg-warning text-sm font-medium flex items-center justify-center mb-1">
                23
              </dt>

              <dd className="text-fg-warning text-sm font-medium">
                In progress
              </dd>
            </dl>

            {/* Done */}
            <dl className="flex h-17 flex-col items-center justify-center rounded-2xl border border-success-subtle bg-success-soft text-fg-success-strong">
              <dt className="w-8 h-8 rounded-full bg-success-medium text-fg-success-strong text-sm font-medium flex items-center justify-center mb-1">
                64
              </dt>

              <dd className="text-fg-success-strong text-sm font-medium">
                Done
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <a href="#" className="hover:underline hover:text-gray-600">
            Home
          </a>
          <span>
            <svg
              className="h-5 w-5 leading-none text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <a href="#" className="hover:underline hover:text-gray-600">
            Electronics
          </a>
          <span>
            <svg
              className="h-5 w-5 leading-none text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span>Headphones</span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-indigo-700 text-indigo-200 md:text-center py-2 px-4">
        Inspired from Dribbble Shot by{" "}
        <a
          href="https://dribbble.com/shots/14127375-Product-Page"
          className="font-bold underline hover:text-indigo-100"
        >
          Vishnu Prasad
        </a>
        . See his works on{" "}
        <a
          href="https://dribbble.com/vlockn"
          className="font-bold underline hover:text-indigo-100"
        >
          Dribbble
        </a>
        .
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-4">
          <div className="flex items-center justify-between md:justify-start">
            {/* Menu Trigger Mobile */}
            <button
              type="button"
              className="md:hidden w-10 h-10 rounded-lg -ml-2 flex justify-center items-center"
            >
              <svg
                className="text-gray-500 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <a href="#" className="font-bold text-gray-700 text-2xl">
              Shop.
            </a>

            <div className="hidden md:flex space-x-3 flex-1 lg:ml-8">
              <a
                href="#"
                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                Electronics
              </a>
              <a
                href="#"
                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                Fashion
              </a>
              <a
                href="#"
                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                Tools
              </a>
              <a
                href="#"
                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                Books
              </a>
              <a
                href="#"
                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                More
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="search"
                  className="pl-10 pr-2 h-10 py-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-inner leading-none"
                  placeholder="Search"
                />
                <svg
                  className="h-6 w-6 text-gray-300 ml-2 mt-2 stroke-current absolute top-0 left-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <a
                href="#"
                className="flex h-10 items-center px-2 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none hover:shadow-inner"
              >
                <svg
                  className="h-6 w-6 leading-none text-gray-300 stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="pl-1 text-gray-500 text-md">0</span>
              </a>

              <button
                type="button"
                className="hidden md:block w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center"
              >
                <img
                  src="https://avatars.dicebear.com/api/bottts/2.svg"
                  alt="bottts"
                  width="28"
                  height="28"
                  className="rounded-lg mx-auto"
                />
              </button>
            </div>
          </div>

          {/* Search Mobile */}
          <div className="relative md:hidden mt-2">
            <input
              type="search"
              className="mt-1 w-full pl-10 pr-2 h-10 py-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-inner leading-none"
              placeholder="Search"
            />
            <svg
              className="h-6 w-6 text-gray-300 ml-2 mt-3 stroke-current absolute top-0 left-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-zinc-800 p-4 sm:p-6">
        <h2 className="mb-5 text-xl font-bold sm:text-2xl">
          Order Information
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Order ID */}
          <div className="rounded-2xl bg-black/40 p-4">
            <p className="text-xs text-zinc-500">Order ID</p>

            <p className="mt-1 break-all text-sm font-semibold">{order?._id}</p>
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-black/40 p-4">
            <p className="text-xs text-zinc-500">Status</p>

            <p className="mt-1 font-semibold capitalize">{order?.status}</p>
          </div>

          {/* Created */}
          <div className="rounded-2xl bg-black/40 p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />

              <p className="text-xs text-zinc-500">Created</p>
            </div>

            <p className="mt-2 text-sm font-semibold">
              {formatDate(order?.createdAt)}
            </p>
          </div>

          {/* Delivery */}
          <div className="rounded-2xl bg-black/40 p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />

              <p className="text-xs text-zinc-500">Delivery Date</p>
            </div>

            <p className="mt-2 text-sm font-semibold">
              {formatDate(order?.deliveryDate)}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="mt-3 rounded-2xl bg-black/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={18} />

            <h3 className="font-semibold">Delivery Address</h3>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-zinc-400 sm:grid-cols-3">
            <p>
              Street:
              <span className="ml-1 text-zinc-200">
                {order?.address?.street}
              </span>
            </p>

            <p>
              City:
              <span className="ml-1 text-zinc-200">{order?.address?.city}</span>
            </p>

            <p>
              Region:
              <span className="ml-1 text-zinc-200">
                {order?.address?.region}
              </span>
            </p>
          </div>
        </div>
        <WhatsAppButton
          message={orderWhatsAppMessage({
            id: order?._id,
            price: order?.price,
            products: order?.products,
          })}
          className="mt-4 w-full"
        >
          التحدث بخصوص الطلب
        </WhatsAppButton>
      </div>
    </>
  );
}
