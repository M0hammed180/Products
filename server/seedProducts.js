const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`;

const products = [
  // =====================================================
  // CLOTHES - 10
  // =====================================================

  {
    name: "Classic White T-Shirt",
    description: "Classic white cotton t-shirt with a clean modern design.",
    price: 450,
    discountPrice: 399,
    images: [pexels(6046231), pexels(13094146), pexels(2294342)],
    category: "clothes",
    stock: 35,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
  },

  {
    name: "Graphic T-Shirt",
    description: "Casual graphic t-shirt with a colorful streetwear design.",
    price: 550,
    discountPrice: 499,
    images: [pexels(2294342), pexels(6046231), pexels(13094146)],
    category: "clothes",
    stock: 28,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: false },
    ],
  },

  {
    name: "Classic Blue Jeans",
    description: "Classic blue denim jeans suitable for everyday outfits.",
    price: 850,
    discountPrice: 749,
    images: [pexels(17630811), pexels(16390571), pexels(17502251)],
    category: "clothes",
    stock: 20,
    isActive: true,
    size: [
      { size: "30", available: true },
      { size: "32", available: true },
      { size: "34", available: true },
      { size: "36", available: true },
    ],
  },

  {
    name: "Denim Jacket",
    description: "Modern denim jacket with a classic casual appearance.",
    price: 1300,
    discountPrice: 1149,
    images: [pexels(16428589), pexels(6765179), pexels(17894645)],
    category: "clothes",
    stock: 16,
    isActive: true,
    size: [
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
  },

  {
    name: "White Sweatshirt",
    description: "Comfortable white sweatshirt with a minimalist design.",
    price: 750,
    discountPrice: 649,
    images: [pexels(8515484), pexels(15847928), pexels(13875086)],
    category: "clothes",
    stock: 25,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
  },

  {
    name: "Black Hoodie",
    description: "Modern black hoodie designed for casual streetwear outfits.",
    price: 950,
    discountPrice: 849,
    images: [pexels(36147525), pexels(36133815), pexels(10378763)],
    category: "clothes",
    stock: 18,
    isActive: true,
    size: [
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
      { size: "XXL", available: false },
    ],
  },

  {
    name: "Elegant Checkered Dress",
    description:
      "Elegant checkered dress suitable for casual and formal occasions.",
    price: 1200,
    discountPrice: 1050,
    images: [pexels(25713204), pexels(14801114), pexels(18310463)],
    category: "clothes",
    stock: 12,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
    ],
  },

  {
    name: "Pink Evening Dress",
    description: "Stylish pink dress designed for elegant occasions.",
    price: 1450,
    discountPrice: 1299,
    images: [pexels(16789648), pexels(16455723), pexels(7901609)],
    category: "clothes",
    stock: 10,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
    ],
  },

  {
    name: "Red Sweatshirt",
    description: "Comfortable red sweatshirt with a modern relaxed fit.",
    price: 800,
    discountPrice: 699,
    images: [pexels(9876432), pexels(5727047), pexels(24589188)],
    category: "clothes",
    stock: 22,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
  },

  {
    name: "Casual Shirt",
    description: "Simple casual shirt with a clean modern appearance.",
    price: 650,
    discountPrice: 579,
    images: [pexels(36904554), pexels(34179645), pexels(28681559)],
    category: "clothes",
    stock: 24,
    isActive: true,
    size: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
  },

  // =====================================================
  // ELECTRONICS - 10
  // =====================================================

  {
    name: "Wireless Headphones",
    description:
      "Modern wireless over-ear headphones with a comfortable design.",
    price: 1800,
    discountPrice: 1599,
    images: [pexels(3394666), pexels(16303233), pexels(815494)],
    category: "electronics",
    stock: 15,
    isActive: true,
    size: [],
  },

  {
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with a modern charging case.",
    price: 1400,
    discountPrice: 1199,
    images: [pexels(13727225), pexels(33242733), pexels(12007330)],
    category: "electronics",
    stock: 25,
    isActive: true,
    size: [],
  },

  {
    name: "Smart Watch",
    description:
      "Modern smartwatch with a sleek display and comfortable strap.",
    price: 3500,
    discountPrice: 2999,
    images: [pexels(14691503), pexels(18241408), pexels(11617965)],
    category: "electronics",
    stock: 18,
    isActive: true,
    size: [],
  },

  {
    name: "Fast USB Charger",
    description: "High-speed USB charger designed for modern smartphones.",
    price: 850,
    discountPrice: 699,
    images: [pexels(20360370), pexels(20360345), pexels(3921695)],
    category: "electronics",
    stock: 35,
    isActive: true,
    size: [],
  },

  {
    name: "Power Bank",
    description: "Portable power bank with USB charging support.",
    price: 1500,
    discountPrice: 1299,
    images: [pexels(3921695), pexels(20360370), pexels(10054192)],
    category: "electronics",
    stock: 20,
    isActive: true,
    size: [],
  },

  {
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with modern wireless audio technology.",
    price: 2200,
    discountPrice: 1899,
    images: [pexels(33080375), pexels(30119133), pexels(7184222)],
    category: "electronics",
    stock: 20,
    isActive: true,
    size: [],
  },

  {
    name: "Mechanical Keyboard",
    description:
      "RGB mechanical keyboard designed for gaming and productivity.",
    price: 2800,
    discountPrice: 2499,
    images: [pexels(28993125), pexels(32313568), pexels(9020270)],
    category: "electronics",
    stock: 14,
    isActive: true,
    size: [],
  },

  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse for work, study and gaming.",
    price: 950,
    discountPrice: 799,
    images: [pexels(7184218), pexels(7430756), pexels(33303045)],
    category: "electronics",
    stock: 32,
    isActive: true,
    size: [],
  },

  {
    name: "Modern Smartphone",
    description:
      "Modern smartphone with a high-quality display and sleek design.",
    price: 18500,
    discountPrice: 17499,
    images: [pexels(2142424), pexels(7151033), pexels(10054192)],
    category: "electronics",
    stock: 8,
    isActive: true,
    size: [],
  },

  {
    name: "10 Inch Tablet",
    description:
      "Modern tablet suitable for study, entertainment and browsing.",
    price: 7500,
    discountPrice: 6999,
    images: [pexels(106341), pexels(11497624), pexels(6372990)],
    category: "electronics",
    stock: 10,
    isActive: true,
    size: [],
  },

  // =====================================================
  // SHOES - 10
  // =====================================================

  {
    name: "Classic White Sneakers",
    description: "Clean white sneakers suitable for everyday casual outfits.",
    price: 1600,
    discountPrice: 1399,
    images: [pexels(13157838), pexels(12571659), pexels(6748354)],
    category: "shoes",
    stock: 24,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: true },
    ],
  },

  {
    name: "Black Urban Sneakers",
    description: "Modern black sneakers designed for urban streetwear.",
    price: 1750,
    discountPrice: 1499,
    images: [pexels(8869242), pexels(20066685), pexels(10353778)],
    category: "shoes",
    stock: 20,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: false },
    ],
  },

  {
    name: "Sport White Sneakers",
    description: "Lightweight white sneakers suitable for sports and walking.",
    price: 1900,
    discountPrice: 1699,
    images: [pexels(6322602), pexels(12739984), pexels(5788986)],
    category: "shoes",
    stock: 22,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },

  {
    name: "Brown Lifestyle Sneakers",
    description: "Stylish brown and white sneakers for everyday wear.",
    price: 2100,
    discountPrice: 1849,
    images: [pexels(20298288), pexels(4252969), pexels(6050912)],
    category: "shoes",
    stock: 15,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: true },
    ],
  },

  {
    name: "Black Leather Sneakers",
    description: "Premium black leather sneakers with a clean modern look.",
    price: 2300,
    discountPrice: 1999,
    images: [pexels(27503505), pexels(11962276), pexels(9311620)],
    category: "shoes",
    stock: 17,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },

  {
    name: "Formal Leather Shoes",
    description:
      "Elegant leather shoes suitable for formal and business outfits.",
    price: 2500,
    discountPrice: 2199,
    images: [pexels(7422198), pexels(7870014), pexels(6069536)],
    category: "shoes",
    stock: 13,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },

  {
    name: "White Street Sneakers",
    description: "Modern white sneakers designed for streetwear outfits.",
    price: 1800,
    discountPrice: 1599,
    images: [pexels(14108062), pexels(5244137), pexels(12739984)],
    category: "shoes",
    stock: 19,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: true },
    ],
  },

  {
    name: "Premium Black Sneakers",
    description: "Premium black sneakers combining comfort and modern style.",
    price: 2700,
    discountPrice: 2399,
    images: [pexels(20066686), pexels(24740379), pexels(3011525)],
    category: "shoes",
    stock: 11,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: true },
    ],
  },

  {
    name: "Classic White Running Shoes",
    description:
      "Comfortable white running shoes for walking and daily activities.",
    price: 2200,
    discountPrice: 1999,
    images: [pexels(4252969), pexels(6322602), pexels(13157838)],
    category: "shoes",
    stock: 18,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },

  {
    name: "Urban Black Sneakers",
    description: "Trendy black sneakers designed for modern urban outfits.",
    price: 2000,
    discountPrice: 1799,
    images: [pexels(5025785), pexels(10353778), pexels(3011525)],
    category: "shoes",
    stock: 21,
    isActive: true,
    size: [
      { size: "40", available: true },
      { size: "41", available: true },
      { size: "42", available: true },
      { size: "43", available: true },
      { size: "44", available: true },
    ],
  },
];
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productSchema");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log("30 products inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
