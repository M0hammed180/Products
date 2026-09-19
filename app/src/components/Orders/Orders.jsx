import React, { useEffect, useState } from "react";
import api from "../api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { orderWhatsAppMessage } from "../../utils/whatsapp";

const formatDate = (date) => {
  if (!date) return "غير محدد";
  return new Date(date).toLocaleDateString();
};

const getAddress = (address = {}) =>
  [address.street, address.city, address.region].filter(Boolean).join(", ") ||
  "العنوان غير متاح";

const Status = ({ children }) => (
  <span className="inline-flex rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold capitalize text-amber-300">
    {children === "pending" ? "قيد المراجعة" : children === "shipped" ? "تم الشحن" : children === "delivered" ? "تم التوصيل" : children || "قيد المراجعة"}
  </span>
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { userId, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    api
      .get(`order/myorders/${userId}`)
      .then((response) => {
        if (response.data.orders) setOrders(response.data.orders || []);
      })
      .catch((error) => console.log("Error fetching orders", error));
  }, [isAuthenticated, userId]);

  return (
    <main className="min-h-screen bg-black px-3 pb-8 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-400">تابع وراجع طلباتك</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">طلباتي</h1>
          </div>
          <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
            {orders.length} {orders.length === 1 ? "طلب" : "طلبات"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-8 text-center shadow-xl">
            <h2 className="text-lg font-semibold">لا توجد طلبات بعد</h2>
            <p className="mt-2 text-sm text-zinc-400">ستظهر طلباتك هنا بعد تأكيدها.</p>
            <Link to="/products" className="mt-5 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 font-semibold text-black transition hover:bg-amber-500">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-700 shadow-xl md:block">
              <table className="w-full min-w-[900px] text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 text-xs uppercase text-zinc-400">
                  <tr>
                    <th scope="col" className="px-5 py-4">الطلب</th>
                    <th scope="col" className="px-5 py-4">عنوان التوصيل</th>
                    <th scope="col" className="px-5 py-4">تاريخ التوصيل</th>
                    <th scope="col" className="px-5 py-4">الحالة</th>
                    <th scope="col" className="px-5 py-4 text-left">الإجمالي</th>
                    <th scope="col" className="px-5 py-4"><span className="sr-only">التواصل عبر واتساب</span></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-zinc-700 bg-zinc-800 transition hover:bg-zinc-700">
                      <td className="max-w-44 px-5 py-4 font-semibold">
                        <Link to={`/order/${order._id}`} className="block truncate text-white hover:text-amber-300" title={order._id}>
                          #{order._id}
                        </Link>
                      </td>
                      <td className="max-w-72 truncate px-5 py-4 text-zinc-300" title={getAddress(order.address)}>{getAddress(order.address)}</td>
                      <td className="whitespace-nowrap px-5 py-4">{formatDate(order.deliveryDate)}</td>
                      <td className="px-5 py-4"><Status>{order.status}</Status></td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">${order.price}</td>
                      <td className="px-5 py-4">
                        <WhatsAppButton
                          message={orderWhatsAppMessage(order)}
                          className="whitespace-nowrap"
                        >
                          التحدث بخصوص الطلب
                        </WhatsAppButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {orders.map((order) => (
                <article key={order._id} className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg">
                  <Link to={`/order/${order._id}`} className="block transition active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs tracking-wide text-zinc-500">الطلب</p>
                      <p className="mt-1 truncate font-semibold text-white">#{order._id}</p>
                    </div>
                    <Status>{order.status}</Status>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-zinc-700 pt-4 text-sm">
                    <div className="col-span-2 min-w-0">
                      <dt className="text-zinc-500">عنوان التوصيل</dt>
                      <dd className="mt-1 truncate text-zinc-200">{getAddress(order.address)}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">تاريخ التوصيل</dt>
                      <dd className="mt-1 text-zinc-200">{formatDate(order.deliveryDate)}</dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-zinc-500">الإجمالي</dt>
                      <dd className="mt-1 font-bold text-white">${order.price}</dd>
                    </div>
                  </dl>
                  <span className="mt-4 block text-sm font-semibold text-amber-300">عرض تفاصيل الطلب ←</span>
                  </Link>
                  <WhatsAppButton message={orderWhatsAppMessage(order)} className="mt-4 w-full">
                    التحدث بخصوص الطلب
                  </WhatsAppButton>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
