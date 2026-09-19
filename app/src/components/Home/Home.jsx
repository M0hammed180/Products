import React, { useEffect, useRef } from "react";
import background from "../../../public/shyaka_logo_light.png";
import person from "../../../public/photos/person.png";
import jacket from "../../../public/photos/jacket.png";
import pantalon from "../../../public/photos/pantalon.png";
import shoes from "../../../public/photos/shoes.png";
import p1 from "../../../public/1.png";
import p2 from "../../../public/2.png";
import p3 from "../../../public/3.png";
import p4 from "../../../public/4.png";
import p5 from "../../../public/5.png";
import p6 from "../../../public/6.png";
import { ArrowLeft, Heart5, ShoppingCart, Trash9 } from "reicon-react";
import { setCartCount } from "../../Redux/pageSlice";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCartProductIds,
  setCategoty,
  setSearch,
  setSearchOrder,
} from "../../Redux/pageSlice";
import { useState } from "react";
import api from "../api";
import ProductCard2 from "../Elements/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const jac = useRef(null);
  const pant = useRef(null);
  const shoe = useRef(null);
  const two = useRef(null);
  const leftColumn = useRef(null);
  const jacketTarget = useRef(null);
  const pantalonTarget = useRef(null);
  const shoesTarget = useRef(null);
  const jacketBox = useRef(null);
  const pantalonBox = useRef(null);
  const shoesBox = useRef(null);
  const { isAuthenticated, userId } = useSelector((state) => state.user);
  const {
    search,
    searchOrder,
    category,
    cartProductIds,
    favouritesProductIds,
  } = useSelector((state) => state.page);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  //products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("product/products");
      setProducts(response.data.products ?? []);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const scrollProducts = (direction) => {
    productsRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };
  return (
    <>
      <section className="min-h-screen w-full bg-black pt-13 sm:pt-28">
        <div className="mx-auto w-full max-w-5xl bg-black px-4 py-7 sm:px-6 md:px-10">
          <div className="mb-4">
            <p className="text-sm text-amber-400">تسوّق حسب القسم</p>
            <h2 className="mt-1 text-2xl font-bold text-white">الأقسام</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "tshirts",
                title: "تيشيرتات",
                description: "اختيارات مريحة تناسب كل يوم.",
                image: jacket,
              },
              {
                id: "pantalons",
                title: "بناطيل",
                description: "تصاميم عملية بإطلالة مميزة.",
                image: pantalon,
              },
              {
                id: "shoes",
                title: "أحذية",
                description: "أحذية تكمل إطلالتك بثقة.",
                image: shoes,
              },
            ].map((categoryItem) => (
              <Link
                key={categoryItem.id}
                to="/products"
                onClick={() => dispatch(setCategoty(categoryItem.id))}
                className="group flex min-h-36 items-center gap-4 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-4 transition hover:border-amber-400/70 hover:bg-zinc-800 sm:min-h-44 sm:p-5"
              >
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-zinc-200 p-3 sm:h-32 sm:w-32">
                  <img
                    src={categoryItem.image}
                    alt={categoryItem.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center text-right">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {categoryItem.title}
                  </h3>
                  {/* <p className="mt-1 text-sm text-zinc-400 sm:text-base">
                    {categoryItem.description}
                  </p> */}
                  <span className="mt-4 inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition group-hover:bg-amber-300">
                    اذهب للتسوق ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative min-h-1/2 w-screen bg-black px-6 py-7 md:px-10 mx-auto ">
          <div className="">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-white">المنتجات</h2>
              <div className="flex items-center gap-5">
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
                <Link
                  to="/products"
                  onClick={() => dispatch(setCategoty(""))}
                  className="mt-0 flex items-center rounded-full bg-zinc-600/50 px-3 py-2 text-xs font-medium uppercase text-white backdrop-blur-md hover:bg-zinc-500/50 focus:outline-none"
                >
                  <span>تصفح الكل </span>
             <ArrowLeft />
                </Link>
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
                const isinmyFavourites = favouritesProductIds.includes(
                  product._id,
                );

                return (
                  <Link
                    key={product._id}
                    to={`/product_detail/${product._id}`}
                    className="w-[min(78vw,180px)] md:w-[min(78vw,280px)] shrink-0 snap-start sm:w-70"
                  >
                    <ProductCard2
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
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
