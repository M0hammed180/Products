import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Elements/Loading";
import api from "../api";
import { Send, Package, MapPin, CalendarDays } from "lucide-react";
const statusSteps = ["pending", "shipped", "delivered"];
import socket from "../../api/socket";
import { useSelector } from "react-redux";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { orderWhatsAppMessage } from "../../utils/whatsapp";
import { FaPhone } from "react-icons/fa";

const OrderPage = () => {
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState({});
  const { userId } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);

  const currentStep = statusSteps.indexOf(order?.status);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toISOString().split("T")[0];
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      orderId: id,
      senderId: userId,
      text: message,
    });

    setMessage("");
  };

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order/myorder/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getMessages = async () => {
    try {
      const { data } = await api.get(`/messages/${id}`);
      setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOrder();
    getMessages();
  }, [id]);

  useEffect(() => {
    if (!id || !userId) return;
    try {
      // Join room
      socket.emit("join_order", {
        orderId: id,
        userId: userId,
      });

      // Receive new message
      const receiveMessage = (message) => {
        setMessages((prev) => [...(prev || []), message]);
      };

      socket.on("receive_message", receiveMessage);

      return () => {
        socket.off("receive_message", receiveMessage);
      };
    } catch (error) {
      console.log(error);
    }
  }, [id, userId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="not-md:min-h-screen md:h-screen bg-black px-4  pt-28 text-zinc-200 sm:px-6 py-7 ">
      <div className="mx-auto max-w-7xl">
        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* =========================
              LEFT - PRODUCTSE
          ========================== */}
          <div className=" rounded-3xl bg-zinc-800 p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold sm:text-2xl">المنتجات</h2>

              <p className="mt-1 text-sm text-zinc-400">
                {order?.products?.length || 0} products
              </p>
            </div>

            <div className="space-y-4">
              {order?.products?.map((item) => {
                const product = item.productId;

                const productPrice =
                  product?.discountPrice ?? product?.price ?? 0;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 rounded-2xl bg-black/40 p-3 sm:p-4"
                  >
                    {/* Image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-700 sm:h-28 sm:w-24">
                      <img
                        src={product?.images?.[0]}
                        alt={product?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className="truncate text-base font-semibold sm:text-lg">
                          {product?.name}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">
                          Category: {product?.category}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm text-zinc-400">
                          Quantity:{" "}
                          <span className="font-semibold text-zinc-200">
                            {item.count}
                          </span>
                        </span>

                        <span className="font-bold">ج.م.{productPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-zinc-700 pt-5">
              <span className="text-lg font-semibold">الإجمالي</span>

              <span className="text-2xl font-bold">ج.م.{order?.price}</span>
            </div>
          </div>

          {/* =========================
                CHAT
            ========================== */}
          <div className="">
            <WhatsAppButton
              message={orderWhatsAppMessage(order)}
              className="mb-4 w-full"
            >
              التحدث بخصوص الطلب
            </WhatsAppButton>
            <a
              href="tel:+201200105320"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50 mb-4 w-full"
            >
              <FaPhone className="h-5 w-5" aria-hidden="true" />
              <span>الاتصال عبر الهاتف</span>
            </a>
            <div className="flex min-h-120  flex-col overflow-hidden rounded-3xl bg-zinc-800 ">
              {/* Chat Header */}
              <div className="border-b border-zinc-700 p-4">
                <h2 className="text-lg font-bold sm:text-xl">محادثة الطلب</h2>

                <p className="text-sm text-zinc-500">تواصل مع المتجر</p>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                {messages?.map((message) => {
                  const mine =
                    message.senderId === userId ||
                    message.senderId?._id === userId;

                  return (
                    <div
                      key={message._id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:max-w-[70%] ${
                          mine
                            ? "bg-zinc-200 text-black"
                            : "bg-black/50 text-zinc-200"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="border-t border-zinc-700 p-3 sm:p-4">
                <div className="flex items-center gap-2 rounded-2xl bg-black/50 p-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder="اكتب رسالتك..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                  />

                  <button
                    onClick={sendMessage}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-black transition hover:bg-white"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
