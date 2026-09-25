import React, { useEffect, useState } from "react";
import api from "../../api";
import { Box2, Eye3, Heart5, ShoppingCart, Unread } from "reicon-react";

export default function Dashboard() {
  const [data, setData] = useState({
    products: [],
    mostViewed: [],
    bestSelling: [],
    mostAddedToCart: [],
    mostAddedToFavorite: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchEventData = async () => {
    try {
      const res = await api.get("/product/event");
      console.log(res.data);

      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">جاري التحميل...</p>
      </div>
    );
  }

  // أول منتج (الكبير في النص)
  const featuredProduct = data.products?.[0];
  // باقي المنتجات (8 منتجات)
  const remainingProducts = data.products?.slice(1, 9) || [];

  // البيانات الأربع (limit 10)
  const mostViewedLimited = data.mostViewed?.slice(0, 10) || [];
  const bestSellingLimited = data.bestSelling?.slice(0, 10) || [];
  const cartLimited = data.mostAddedToCart?.slice(0, 10) || [];
  const favoriteLimited = data.mostAddedToFavorite?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-4 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          إحصائيات المبيعات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* المنتجات المباعة */}
          <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg hover:shadow-xl transition-shadow border border-zinc-700">
            <div>
              <p className="text-zinc-400 text-sm font-semibold mb-2">
                المنتجات المباعة
              </p>
              <p className="text-4xl font-bold text-white">
                {data?.totalSalesAnalytics?.soldQuantity || 0}
              </p>
              <p className="text-xs text-zinc-500 mt-2">عدد الوحدات المباعة</p>
            </div>
          </div>

          {/* الطلبات */}
          <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg hover:shadow-xl transition-shadow border border-zinc-700">
            <div>
              <p className="text-zinc-400 text-sm font-semibold mb-2">
                الطلبات
              </p>
              <p className="text-4xl font-bold text-white">
                {data?.orders || 0}
              </p>
              <p className="text-xs text-zinc-500 mt-2">عدد الطلبات الإجمالي</p>
            </div>
          </div>

          {/* إجمالي المبيعات */}
          <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg hover:shadow-xl transition-shadow border border-zinc-700">
            <div>
              <p className="text-zinc-400 text-sm font-semibold mb-2">
                إجمالي المبيعات
              </p>
              <p className="text-4xl font-bold text-white">
                {data?.totalSales[0]?.totalSales || 0}
              </p>
              <p className="text-xs text-zinc-500 mt-2">جنيه مصري</p>
            </div>
          </div>
        </div>
      </div>
      {/* القسم الأول: المنتج الكبير والمنتجات الصغيرة */}
      <div className="mb-12">
        {/* المنتج الكبير في النص */}
        {featuredProduct && (
          <div className="mb-8 rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* الصورة */}
              <div className="flex justify-center">
                <img
                  src={featuredProduct.product?.images?.[0]}
                  alt={featuredProduct.product?.name}
                  className="h-64 w-64 object-cover rounded-2xl"
                />
              </div>
              {/* التفاصيل */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-4xl font-bold text-cyan-600">1</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    الأول
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {featuredProduct.product?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {featuredProduct.product?.description}
                </p>
                <div className="flex gap-4 items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {featuredProduct.product?.discountPrice} جنيه
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {featuredProduct.product?.price} جنيه
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      المشاهدات
                    </span>
                    <p className="text-lg font-bold text-cyan-600">
                      {featuredProduct.score?.views || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      الطلبات
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      {featuredProduct.score?.orders || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      السلة
                    </span>
                    <p className="text-lg font-bold text-blue-600">
                      {featuredProduct.score?.addToCart || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      المفضلة
                    </span>
                    <p className="text-lg font-bold text-red-600">
                      {featuredProduct.score?.favorites || 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>درجة الشهرة: {featuredProduct.popularityScore}</span>
                  <span>المخزون: {featuredProduct.product?.stock}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* المنتجات الصغيرة (8 منتجات) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {remainingProducts.map((product, index) => (
            <div
              key={product.product?._id}
              className="rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="mb-2 flex justify-between items-center">
                <span className="text-lg font-bold text-cyan-600">
                  #{index + 2}
                </span>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  {product.popularityScore}
                </span>
              </div>
              <img
                src={product.product?.images?.[0]}
                alt={product.product?.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {product.product?.name}
              </h3>
              <div className="text-sm mb-3">
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.product?.discountPrice}
                </span>
                <span className="text-gray-400 line-through ms-2 text-xs">
                  {product.product?.price}
                </span>
              </div>

              {/* الإحصائيات الصغيرة */}
              <div className="grid grid-cols-4 gap-1 mb-2 text-xs">
                <div className=" dark:bg-zinc-700 text-zinc-200 p-1 rounded text-center flex flex-col items-center gap-1">
                  <div className="font-bold">{product.score?.views || 0}</div>
                  <div className="text-xs">
                    <Eye3 size={15} />
                  </div>
                </div>
                <div className=" dark:bg-zinc-700 text-zinc-200 p-1 rounded text-center flex flex-col items-center gap-1">
                  <div className="font-bold">{product.score?.orders || 0}</div>
                  <div className="text-xs">
                    <Box2 size={15} />
                  </div>
                </div>
                <div className=" dark:bg-zinc-700 text-zinc-200  p-1 rounded text-center flex flex-col items-center gap-1">
                  <div className="font-bold">
                    {product.score?.addToCart || 0}
                  </div>
                  <div className="text-xs">
                    <ShoppingCart size={15} />
                  </div>
                </div>
                <div className=" dark:bg-zinc-700 text-zinc-200 p-1 rounded text-center flex flex-col items-center gap-1">
                  <div className="font-bold">
                    {product.score?.favorites || 0}
                  </div>
                  <div className="text-xs">
                    <Heart5 size={15} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                المخزون: {product.product?.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* القسم الثاني: الإحصائيات الأربعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* أكثر المشاهدة */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            أكثر المنتجات مشاهدة
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mostViewedLimited.map((item, index) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <span className="font-bold text-yellow-600 min-w-fit">
                  #{index + 1}
                </span>
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.product?.discountPrice} جنيه
                  </p>
                </div>
                <span className="text-sm text-yellow-600 font-bold min-w-fit flex flex-row-reverse gap-1 items-center">
                  {item.views || 0} <Eye3 size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* أكثر المشتريات */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            أكثر المنتجات مبيعاً
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bestSellingLimited.length > 0 ? (
              bestSellingLimited.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="font-bold text-cyan-600 min-w-fit">
                    #{index + 1}
                  </span>
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product?.discountPrice} جنيه
                    </p>
                  </div>
                  <span className="text-sm text-cyan-600 font-bold min-w-fit flex flex-row-reverse gap-1 items-center">
                    {item.orders || 0} <Box2 size={16} />
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد بيانات</p>
            )}
          </div>
        </div>

        {/* أكثر الإضافة للسلة */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            أكثر إضافة للسلة
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cartLimited.length > 0 ? (
              cartLimited.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="font-bold text-blue-600 min-w-fit">
                    #{index + 1}
                  </span>
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product?.discountPrice} جنيه
                    </p>
                  </div>
                  <span className="text text-blue-600 font-bold min-w-fit flex flex-row-reverse gap-1 items-center">
                    {item.addToCart || 0} <ShoppingCart size={16} />
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد بيانات</p>
            )}
          </div>
        </div>

        {/* أكثر الإضافة للمفضلة */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            أكثر إضافة للمفضلة
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {favoriteLimited.length > 0 ? (
              favoriteLimited.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="font-bold text-red-600 min-w-fit">
                    #{index + 1}
                  </span>
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product?.discountPrice} جنيه
                    </p>
                  </div>
                  <span className=" text-red-600 font-bold min-w-fit flex flex-row-reverse gap-1 items-center">
                    {item.wishlist || 0} <Heart5 size={16} />
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد بيانات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
