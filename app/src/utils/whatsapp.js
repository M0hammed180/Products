const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  "",
);

export const isWhatsAppConfigured = Boolean(whatsappNumber);

export const createWhatsAppUrl = (message) => {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const productWhatsAppMessage = ({ name, price, image }) =>
  [
    "مرحبًا، أريد الاستفسار عن هذا المنتج:",
    `اسم المنتج: ${name || "-"}`,
    `السعر: ${price ?? "-"}`,
    image ? `رابط الصورة: ${image}` : null,
  ]
    .filter(Boolean)
    .join("\n");

export const orderWhatsAppMessage = ({ id, _id, price, products = [] }) => {
  const productLines = products
    .map((item) => {
      const product = item.productId || item;
      return `- ${product?.name || "منتج"} × ${item.count || 1}`;
    })
    .join("\n");

  return [
    "مرحبًا، أريد الاستفسار عن طلبي:",
    `رقم الطلب: ${id || _id || "-"}`,
    price != null ? `إجمالي الطلب: ${price}` : null,
    productLines ? `المنتجات:\n${productLines}` : null,
  ]
    .filter(Boolean)
    .join("\n");
};
