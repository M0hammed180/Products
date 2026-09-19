import { ChevronLeft, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeLabels = {
  products: "المنتجات",
  product_detail: "تفاصيل المنتج",
  cart: "سلة التسوق",
  fav: "المفضلة",
  orders: "طلباتي",
  order: "تفاصيل الطلب",
  edit_profile: "الملف الشخصي",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  dashboard: "لوحة التحكم",
  add_product: "إضافة منتج",
  edit_product: "تعديل المنتج",
  products_admin: "إدارة المنتجات",
  users: "المستخدمون",
  add_user: "إضافة مستخدم",
  edit_user: "تعديل المستخدم",
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  if (pathname === "/") return null;

  const crumbs = parts.map((part, index) => {
    const previousPart = parts[index - 1];
    const isId = ["product_detail", "order", "edit_product", "edit_user"].includes(
      previousPart,
    );

    return {
      label: isId ? "التفاصيل" : routeLabels[part] || part.replace(/[-_]/g, " "),
      to: `/${parts.slice(0, index + 1).join("/")}`,
    };
  });

  // لا ننشئ رابطًا غير صالح مثل /product_detail أو /order بدون المعرّف.
  const pageCrumbs =
    ["product_detail", "order", "edit_product", "edit_user"].includes(parts[0]) &&
    parts[1]
      ? [{ label: routeLabels[parts[0]], to: pathname }]
      : crumbs;

  return (
    <nav
      aria-label="مسار التنقل"
      className="pointer-events-none absolute right-3 top-18 z-20 max-w-[calc(100%-1.5rem)] sm:right-6"
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-zinc-400 sm:text-sm">
        <li className="pointer-events-auto">
          <Link to="/" className="inline-flex items-center gap-1 transition hover:text-amber-300">
            <Home className="h-3.5 w-3.5" />
            <span>الرئيسية</span>
          </Link>
        </li>
        {pageCrumbs.map((crumb, index) => {
          const isLast = index === pageCrumbs.length - 1;

          return (
            <li key={crumb.to} className="flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
              {isLast ? (
                <span className="max-w-32 truncate text-zinc-200">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="pointer-events-auto transition hover:text-amber-300">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
