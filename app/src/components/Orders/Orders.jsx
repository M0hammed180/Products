import React, { useEffect, useState } from "react";
import api from "../api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { orderWhatsAppMessage } from "../../utils/whatsapp";
import { FaPhone } from "react-icons/fa";
import socket from "../../api/socket";
import Loading from "../Elements/Loading";

const formatDate = (date) => {
  if (!date) return "غير محدد";
  return new Date(date).toLocaleDateString();
};

const getAddress = (address = {}) =>
  [address.street, address.city, address.region].filter(Boolean).join(", ") ||
  "العنوان غير متاح";

const Status = ({ children }) => (
  <span className="inline-flex rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold capitalize text-amber-300">
    {children === "pending"
      ? "قيد المراجعة"
      : children === "shipped"
        ? "تم الشحن"
        : children === "delivered"
          ? "تم التوصيل"
          : children || "قيد المراجعة"}
  </span>
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { userId, isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit("admin");
  }, []);

  //fetchOrders
  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    setLoading(true);
    api
      .get(`order/myorders/${userId}`)
      .then((response) => {
        if (response.data.orders) setOrders(response.data.orders || []);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching orders", error);
        setLoading(false);
      });
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("NEW MESSAGE:", message);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          String(order._id) === String(message.orderId)
            ? {
                ...order,
                lastMessage: message,
                messages: (order.messages || 0) + 1,
              }
            : order,
        ),
      );
    };

    socket.on("new_order_message", handleNewMessage);

    return () => {
      socket.off("new_order_message", handleNewMessage);
    };
  }, []);

  const ProductImageStack = ({ images = [], name, height = "h-20" }) => {
    return (
      <div className={`relative ${height} w-15 overflow-visible`}>
        {images.reverse().map((item, index) => {
          const isMain = index === images.length - 1;

          const offset = (images.length - 1 - index) * 3;
          const rotate = -(images.length - 1 - index) * 1.5;

          return (
            <div
              key={index}
              className={`
              absolute
              h-full
              w-full
              overflow-hidden
              rounded-2xl
              bg-white
              ${
                isMain
                  ? "z-10 shadow-[0_10px_30px_rgba(0,0,0,0.75)]"
                  : "shadow-[0_8px_25px_rgba(0,0,0,0.65)]"
              }
            `}
              style={{
                left: `-${offset}px`,
                top: `${offset}px`,
                transform: `rotate(${rotate}deg)`,
                zIndex: index,
              }}
            >
              <img
                src={item.productId?.images?.[0]}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <main className="min-h-screen bg-black px-3 pb-8 pt-25 text-white sm:px-6   lg:px-8">
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
            <p className="mt-2 text-sm text-zinc-400">
              ستظهر طلباتك هنا بعد تأكيدها.
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
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-700 shadow-xl md:block">
              <table className="w-full min-w-225 text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 text-xs uppercase text-zinc-400">
                  <tr className=" text-right">
                    <th scope="col" className="px-5 py-4  ">
                      الطلب
                    </th>
                    <th scope="col" className="px-5 py-4  ">
                      الإجمالي
                    </th>
                    <th scope="col" className="px-5 py-4 ">
                      الرسائل الغير مقروئة
                    </th>
                    <th scope="col" className="px-5 py-4 ">
                      آخر رسالة
                    </th>
                    <th scope="col" className="px-5 py-4 ">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-zinc-700 bg-zinc-800 transition hover:bg-zinc-700"
                    >
                      <td className=" whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        <Link
                          to={`/order/${order._id}`}
                          className="  text-white hover:text-amber-300 flex items-center justify-start gap-5"
                          title={order._id}
                        >
                          <ProductImageStack
                            images={order.products}
                            name={order._id}
                          />
                          <p className=" truncate font-semibold text-white">
                            #{order._id}
                          </p>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        ج.م.{order.price}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        {order.messages >= 1 ? (
                          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-amber-600">
                            {order.messages}
                          </span>
                        ) : (
                          <span>{order.messages}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        {order.lastMessage ? (
                          <span dir="rtl">
                            {order?.lastMessage.senderId == userId
                              ? "Me"
                              : "Admin"}
                            : {order?.lastMessage?.text}
                          </span>
                        ) : (
                          "لا توجد رسائل"
                        )}
                      </td>
                      <td
                        className={`whitespace-nowrap px-5 py-4 text-right font-semibold text-white`}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg"
                >
                  <Link
                    to={`/order/${order._id}`}
                    className="block transition active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-full flex items-center justify-between">
                        <ProductImageStack
                          images={order.products}
                          name={order._id}
                        />
                        <p className=" truncate font-semibold text-white">
                          #{order._id}
                        </p>
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-zinc-700 pt-4 text-sm">
                      <div className="text-right">
                        <dt className="text-zinc-500">الإجمالي</dt>
                        <dd className="mt-1 font-bold text-white">
                          ج.م.{order.price}
                        </dd>
                      </div>
                      <div className="text-right">
                        <dt className="text-zinc-500">الحالة</dt>
                        <dd
                          className={`mt-1 font-bold  capitalize w-fit ${order.status == "delivered" ? "bg-zinc-900 text-white" : "bg-yellow-50 text-black"} rounded-full px-2 py-1`}
                        >
                          {order.status}
                        </dd>
                      </div>
                      <div className="text-right">
                        <dt className="text-zinc-500"> الرسائل الغير مقروئة</dt>
                        <dd className="mt-1 font-bold text-white">
                          {order.messages >= 1 ? (
                            <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-amber-600">
                              {order.messages}
                            </span>
                          ) : (
                            <span>{order.messages}</span>
                          )}
                        </dd>
                      </div>
                      {order.lastMessage && (
                        <div className="text-right">
                          <dt className="text-zinc-500"> آخر رسالة</dt>
                          <dd className="mt-1 font-bold text-white">
                            <span dir="rtl">
                              {order?.lastMessage.senderId == userId
                                ? "Me"
                                : "Admin"}
                              : {order?.lastMessage?.text}
                            </span>
                          </dd>
                        </div>
                      )}
                    </dl>
                    <span className="mt-4 block text-sm font-semibold text-amber-300">
                      عرض تفاصيل الطلب ←
                    </span>
                  </Link>
                  {/* <div className="flex items-center justify-around mt-2">
                    {" "}
                    <WhatsAppButton
                      message={orderWhatsAppMessage(order)}
                      className=" w-fit"
                    >
                      التحدث بخصوص الطلب
                    </WhatsAppButton>
                    <a
                      href="tel:01200105320"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 w-fit"
                    >
                      <FaPhone className="h-5 w-5" aria-hidden="true" />
                      <span>الاتصال عبر الهاتف</span>
                    </a>
                  </div> */}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
