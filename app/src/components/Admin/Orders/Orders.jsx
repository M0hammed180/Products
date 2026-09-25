import React, { useEffect, useState } from "react";
import api from "../../api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../../../api/socket";
import Loading from "../../Elements/Loading";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { userId, isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit("admin");
  }, []);

  // Product Image Stack
  const ProductImageStack = ({ images = [], name, height = "h-20" }) => {
    const reversedImages = [...images].reverse();

    return (
      <div className={`relative ${height} w-15 overflow-visible`}>
        {reversedImages.map((item, index) => {
          const isMain = index === reversedImages.length - 1;

          const offset = (reversedImages.length - 1 - index) * 3;

          const rotate = -(reversedImages.length - 1 - index) * 1.5;

          return (
            <div
              key={item._id || index}
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

  // Fetch Orders
  const fetchOrders = () => {
    if (!isAuthenticated || !userId) return;

    setLoading(true);

    api
      .get(`order/myorders/${userId}`)
      .then((response) => {
        if (response.data.orders) {
          setOrders(response.data.orders || []);
        }

        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching orders", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, userId]);

  // New Message
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

  //changeStatus
  const changeStatus = (id, status) => {
    try {
      api.post("order/editStatus", { id, status });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-black px-3 pb-8 pt-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl">
        {/* Header */}
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
          /* Empty */
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
            {/* ================= DESKTOP ================= */}
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-700 shadow-xl md:block">
              <table className="w-full min-w-225 text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 text-xs uppercase text-zinc-400">
                  <tr className="text-right">
                    <th scope="col" className="px-5 py-4">
                      الطلب
                    </th>

                    <th scope="col" className="px-5 py-4">
                      المستخدم
                    </th>

                    <th scope="col" className="px-5 py-4">
                      الإجمالي
                    </th>

                    <th scope="col" className="px-5 py-4">
                      الرسائل الغير مقروئة
                    </th>

                    <th scope="col" className="px-5 py-4">
                      آخر رسالة
                    </th>
                    <th scope="col" className="px-5 py-4">
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
                      {/* Order */}
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        <Link
                          to={`/order/${order._id}`}
                          className="flex items-center gap-5 text-white hover:text-amber-300"
                          title={order._id}
                        >
                          <ProductImageStack
                            images={order.products}
                            name={order._id}
                          />

                          <p className="truncate font-semibold text-white">
                            #{order._id}
                          </p>
                        </Link>
                      </td>

                      {/* User */}
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.userId?.avatar}
                            className="h-8 w-8 rounded-full object-cover"
                            alt={order.userId?.name || ""}
                          />

                          <p>{order.userId?.name}</p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        ج.م.{order.price}
                      </td>

                      {/* Messages */}
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        {order.messages >= 1 ? (
                          <span className="rounded-full bg-amber-600 px-2 py-0.5 md:px-3 md:py-1">
                            {order.messages}
                          </span>
                        ) : (
                          <span>{order.messages}</span>
                        )}
                      </td>

                      {/* Last Message */}
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        {order.lastMessage ? (
                          <span dir="ltr">
                            {order?.lastMessage?.senderId == userId
                              ? "Me"
                              : order.userId?.name}
                            : {order?.lastMessage?.text}
                          </span>
                        ) : (
                          "لا توجد رسائل"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-white">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            changeStatus(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE ================= */}
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
                      <div className="flex w-full items-center justify-between gap-3">
                        {/* Product Images */}
                        <ProductImageStack
                          images={order.products}
                          name={order._id}
                        />

                        {/* Order ID */}
                        <div className="min-w-0 text-right">
                          <p className="text-xs tracking-wide text-zinc-500">
                            الطلب
                          </p>

                          <p className="mt-1 truncate font-semibold text-white">
                            #{order._id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-zinc-700 pt-4 text-sm">
                      {/* Price */}
                      <div className="text-right">
                        <dt className="text-zinc-500">الإجمالي</dt>

                        <dd className="mt-1 font-bold text-white">
                          ج.م.{order.price}
                        </dd>
                      </div>
                      <div className="text-right">
                        <dt className="text-zinc-500">الحالة</dt>

                        <dd
                          onClick={(e) => e.preventDefault()}
                          className="mt-1 font-bold text-white"
                        >
                          <select
                            value={order.status}
                            onChange={(e) =>
                              changeStatus(order._id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </dd>
                      </div>

                      {/* User */}
                      <div className="text-right">
                        <dt className="text-zinc-500">المستخدم</dt>

                        <dd className="mt-1 flex items-center justify-start gap-2 font-bold text-white">
                          <img
                            src={order.userId?.avatar}
                            className="h-8 w-8 rounded-full object-cover"
                            alt={order.userId?.name || ""}
                          />

                          <p>{order.userId?.name}</p>
                        </dd>
                      </div>

                      {/* Messages */}
                      <div className="text-right">
                        <dt className="text-zinc-500">الرسائل الغير مقروئة</dt>

                        <dd className="mt-1 font-bold text-white">
                          {order.messages >= 1 ? (
                            <span className="rounded-full bg-amber-600 px-2 py-0.5 md:px-3 md:py-1">
                              {order.messages}
                            </span>
                          ) : (
                            <span>{order.messages}</span>
                          )}
                        </dd>
                      </div>

                      {/* Last Message */}
                      {order.lastMessage && (
                        <div className="text-right">
                          <dt className="text-zinc-500">آخر رسالة</dt>

                          <dd className="mt-1 font-bold text-white">
                            <span dir="ltr">
                              {order?.lastMessage?.senderId == userId
                                ? "Me"
                                : order.userId?.name}
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
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
