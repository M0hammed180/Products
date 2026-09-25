import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../Elements/Loading";
import api from "../api";
import { Send, Package, MapPin, CalendarDays } from "lucide-react";
import socket from "../../api/socket";
import { useSelector } from "react-redux";
import WhatsAppButton from "../Elements/WhatsAppButton";
import { orderWhatsAppMessage } from "../../utils/whatsapp";
import { FaPhone } from "react-icons/fa";
import {
  dataSDisplay,
  DateDisplay,
  TimeDisplay,
} from "../Elements/dateDisplay";
import { FiEdit, FiX } from "react-icons/fi";
import ProductCard from "../Elements/ProductCard";

const statusSteps = ["pending", "shipped", "delivered"];

const OrderPage = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState({});
  const { userId, role } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);

  // =========================
  // Refs
  // =========================
  const messagesContainerRef = useRef(null);
  const longPressTimer = useRef(null);

  const [menu, setMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [newText, setNewText] = useState("");

  const currentStep = statusSteps.indexOf(order?.status);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toISOString().split("T")[0];
  };

  // =========================
  // Scroll to latest message
  // =========================
  useEffect(() => {
    if (!messages?.length) return;

    const timer = setTimeout(() => {
      const container = messagesContainerRef.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [messages]);

  // =========================
  // Right Click
  // =========================
  const handleRightClick = (e, message) => {
    e.preventDefault();

    setMenu({
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  // =========================
  // Long Press
  // =========================
  const handleLongPressStart = (e, msg) => {
    const msgSenderId =
      typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;

    if (msgSenderId !== userId) return;

    longPressTimer.current = setTimeout(() => {
      const touch = e.touches[0];

      setMenu({
        x: touch.clientX,
        y: touch.clientY,
        message: msg,
      });
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // =========================
  // Close Menu
  // =========================
  useEffect(() => {
    const close = () => setMenu(null);

    window.addEventListener("click", close);

    return () => {
      window.removeEventListener("click", close);
    };
  }, []);

  // =========================
  // Send Message
  // =========================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      orderId: id,
      senderId: userId,
      text: message,
      role,
    });

    setMessage("");
  };

  // =========================
  // Fetch Order
  // =========================
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

  // =========================
  // Get Messages
  // =========================
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

  // =========================
  // Socket
  // =========================
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

      // Read message
      const handleReadMessage = (data) => {
        if (data !== userId) {
          setMessages((prev) =>
            (prev || []).map((m) => {
              const senderId =
                typeof m.senderId === "string" ? m.senderId : m.senderId?._id;

              if (senderId === userId) {
                return {
                  ...m,
                  seenBy: true,
                };
              }

              return m;
            }),
          );
        }
      };

      socket.on("receive_message", receiveMessage);
      socket.on("readMessage", handleReadMessage);

      return () => {
        socket.emit("leave_order", {
          orderId: id,
          userId,
        });

        socket.off("receive_message", receiveMessage);
        socket.off("readMessage", handleReadMessage);
      };
    } catch (error) {
      console.log(error);
    }
  }, [id, userId]);

  // =========================
  // Handle Edit
  // =========================
  useEffect(() => {
    const handleEdit = (message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m)),
      );
    };

    socket.on("message_edited", handleEdit);

    return () => {
      socket.off("message_edited", handleEdit);
    };
  }, []);

  // =========================
  // Handle Delete
  // =========================
  useEffect(() => {
    const handleDelete = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("message_deleted", handleDelete);

    return () => {
      socket.off("message_deleted", handleDelete);
    };
  }, []);

  //changeStatus
  const changeStatus = (id, status) => {
    try {
      api.post("order/editStatus", { id, status });
      fetchOrder();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="not-md:min-h-screen md:h-screen bg-black px-4 pt-28 text-zinc-200 sm:px-6 py-7">
      <div className="mx-auto max-w-7xl">
        {/* =========================
            MAIN CONTENT
        ========================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* =========================
            LEFT - PRODUCTS
        ========================== */}

          <div className="rounded-3xl bg-zinc-800 p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold sm:text-2xl">المنتجات</h2>

              <p className="mt-1 text-sm text-zinc-400">
                {order?.products?.length || 0} products
              </p>
            </div>

            {/* Products Horizontal Cards */}
            <div className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
              {order?.products?.map((item) => {
                const product = item.productId;

                return (
                  <div
                    key={item._id}
                    className=" w-[min(78vw,180px)] md:w-[min(78vw,280px)] shrink-0 snap-start sm:w-70 overflow-hidden "
                  >
                    <Link to={`/product_detail/${product?._id}`}>
                      <ProductCard
                        image={product?.images}
                        name={product?.name}
                        price={product?.price}
                        discountPrice={product?.discountPrice}
                        isProductInCart={true}
                        count={item.count}
                        forShow
                      />
                    </Link>
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
            {role === "user" && (
              <>
                <WhatsAppButton
                  message={orderWhatsAppMessage(order)}
                  className="mb-4 w-full"
                >
                  التحدث بخصوص الطلب
                </WhatsAppButton>

                <a
                  href="tel:+201200105320"
                  className="mb-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[blue] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[blue] focus:outline-none focus:ring-2 focus:ring-[blue]/50"
                >
                  <FaPhone className="h-5 w-5" aria-hidden="true" />

                  <span>الاتصال عبر الهاتف</span>
                </a>
              </>
            )}

            {/* =========================
                CHAT CONTAINER
            ========================== */}

            <div className="flex h-120 min-h-0 flex-col overflow-hidden rounded-3xl bg-zinc-800">
              {/* Chat Header */}
              <div className="shrink-0 border-b border-zinc-700 p-4 w-full flex justify-between items-center">
                <div className="">
                  <h2 className="text-lg font-bold sm:text-xl">محادثة الطلب</h2>

                  <p className="text-sm text-zinc-500">تواصل مع المتجر</p>
                </div>
                {role == "admin" ? (
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                ) : (
                  <div
                    className={`mt-1 font-bold  capitalize w-fit ${order.status == "delivered" ? "bg-zinc-900 text-white" : "bg-yellow-50 text-black"} rounded-full px-2 py-1`}
                  >
                    {order.status}
                  </div>
                )}
              </div>

              {/* =========================
                  Context Menu
              ========================== */}

              {menu && (
                <div
                  className="fixed z-50 flex flex-col gap-1 rounded-2xl border border-gray-700 bg-white p-1 shadow dark:bg-black md:p-2"
                  style={{
                    left: menu.x,
                    top: menu.y,
                  }}
                >
                  <button
                    className="block w-full rounded-xl bg-gray-50 px-5 py-2 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
                    onClick={() => {
                      setEditingMessageId(menu.message._id);

                      setNewText(menu.message.text);

                      setMenu(null);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="block w-full rounded-xl bg-gray-50 px-5 py-2 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
                    onClick={() => {
                      socket.emit("delete_message", {
                        messageId: menu.message._id,
                        senderId: userId,
                        id,
                      });

                      setMenu(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* =========================
                  Messages
              ========================== */}

              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5"
              >
                {messages?.map((message, index) => {
                  const mine =
                    message.senderId === userId ||
                    message.senderId?._id === userId;

                  return (
                    <div key={message._id} className="overflow-auto">
                      {/* Date */}
                      <div className="w-full py-2 text-center text-lg md:text-2xl">
                        {index > 0
                          ? Number(
                              DateDisplay(messages[index - 1].createdAt),
                            ) !== Number(DateDisplay(message.createdAt)) &&
                            (new Date(message.createdAt).toDateString() ===
                            new Date().toDateString()
                              ? "Today"
                              : dataSDisplay(message.createdAt))
                          : new Date(message.createdAt).toDateString() ===
                              new Date().toDateString()
                            ? ""
                            : dataSDisplay(message.createdAt)}
                      </div>

                      {/* Message */}
                      <div
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          onContextMenu={(e) =>
                            mine && handleRightClick(e, message)
                          }
                          onTouchStart={(e) => {
                            if (mine) {
                              handleLongPressStart(e, message);
                            }
                          }}
                          onTouchEnd={handleLongPressEnd}
                          onTouchMove={handleLongPressEnd}
                          onTouchCancel={handleLongPressEnd}
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:max-w-[70%] ${
                            mine
                              ? "bg-zinc-200 text-black"
                              : "bg-black/50 text-zinc-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-lg"> {message.text}</p>
                          </div>
                          {message.edited && (
                            <span className=" text-[7px]">Edited</span>
                          )}
                          <div className="flex flex-row-reverse justify-start text-[7px] md:text-[9px] gap-1">
                            {mine &&
                              (message.seenBy ? (
                                <span className="font-bold"> ✓✓ </span>
                              ) : (
                                <span className="font-bold"> ✓ </span>
                              ))}
                            <span className="">
                              {TimeDisplay(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =========================
                  Message Input
              ========================== */}

              {order.status == "pending" && (
                <div className="shrink-0 border-t border-zinc-700 p-3 sm:p-4">
                  {editingMessageId ? (
                    <div className="flex items-center gap-2 rounded-2xl bg-black/50 p-2">
                      <input
                        autoFocus
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            socket.emit("edit_message", {
                              messageId: editingMessageId,
                              senderId: userId,
                              text: newText,
                            });

                            setEditingMessageId(null);
                          }
                        }}
                        placeholder="عدل رسالتك..."
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-zinc-200 outline-none placeholder:text-zinc-600"
                      />

                      <button
                        onClick={() => {
                          setEditingMessageId(null);
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-black transition hover:bg-white"
                      >
                        <FiX size={18} />
                      </button>

                      <button
                        onClick={() => {
                          if (!newText.trim()) return;

                          socket.emit("edit_message", {
                            messageId: editingMessageId,
                            senderId: userId,
                            text: newText,
                            id,
                          });

                          setEditingMessageId(null);
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-black transition hover:bg-white"
                      >
                        <FiEdit size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl bg-black/50 p-2">
                      <input
                        autoFocus
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            sendMessage();
                          }
                        }}
                        placeholder="اكتب رسالتك..."
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-zinc-200 outline-none placeholder:text-zinc-600"
                      />

                      <button
                        onClick={sendMessage}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-black transition hover:bg-white"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
