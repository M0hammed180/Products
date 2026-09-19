import { FaWhatsapp } from "react-icons/fa";
import { createWhatsAppUrl, isWhatsAppConfigured } from "../../utils/whatsapp";

export default function WhatsAppButton({ message, children, className = "" }) {
  const url = createWhatsAppUrl(message);

  const openWhatsApp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (url) window.location.assign(url);
  };

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      // disabled={!isWhatsAppConfigured}
      title={
        isWhatsAppConfigured
          ? "التحدث عبر واتساب"
          : "أضف رقم واتساب في VITE_WHATSAPP_NUMBER أولاً"
      }
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
