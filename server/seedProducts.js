/**
 * Seed script — generates ~100 demo products split across
 * "tshirts", "pantalons" and "shoes" and bulk-inserts them into
 * MongoDB using your existing Product model.
 *
 * Setup:
 *   1. npm install mongoose dotenv
 *   2. Add MONGODB_URI=<your connection string> to a .env file
 *   3. Fix the require() path below to point at your real Product model
 *   4. node seedProducts.js
 *
 * If your project uses ES modules (import/export in package.json),
 * swap the require()/module.exports lines for import/export.
 *
 * Images are placeholder URLs (placehold.co) so every product has a
 * working image while you're building — swap these for real Shyaka
 * product photography before launch.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productSchema"); // <-- adjust to your actual model path

const CATEGORIES = ["tshirts", "pantalons", "shoes"];

const COLORS = [
  "Black",
  "White",
  "Sand",
  "Olive",
  "Navy",
  "Charcoal",
  "Cream",
  "Rust",
  "Stone",
  "Denim blue",
];

const TEMPLATES = {
  tshirts: {
    adjectives: [
      "Classic",
      "Oversized",
      "Slim-fit",
      "Essential",
      "Graphic",
      "Ribbed",
      "Relaxed",
      "Cropped",
      "Heavyweight",
      "Vintage-wash",
    ],
    noun: "T-shirt",
    priceRange: [15, 45],
    sizeSet: ["S", "M", "L", "XL", "XXL"],
  },
  pantalons: {
    adjectives: [
      "Straight-leg",
      "Wide-leg",
      "Tapered",
      "Cargo",
      "Relaxed",
      "Tailored",
      "Cropped",
      "High-waist",
      "Slim",
      "Utility",
    ],
    noun: "Pants",
    priceRange: [25, 70],
    sizeSet: ["S", "M", "L", "XL", "XXL"],
  },
  shoes: {
    adjectives: [
      "Low-top",
      "High-top",
      "Runner",
      "Slip-on",
      "Canvas",
      "Leather",
      "Retro",
      "Minimal",
      "Chunky",
      "Suede",
    ],
    noun: "Sneaker",
    priceRange: [40, 120],
    sizeSet: ["39", "40", "41", "42", "43", "44", "45"],
  },
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildProduct(category, index) {
  const t = TEMPLATES[category];
  const color = randomFrom(COLORS);
  const adjective = randomFrom(t.adjectives);
  const name = `${color} ${adjective} ${t.noun}`;
  const price = randomInt(t.priceRange[0], t.priceRange[1]);
  const hasDiscount = Math.random() < 0.3;

  return {
    name,
    description: `${name} — clean lines, a comfortable fit, and details built to last through everyday wear.`,
    price,
    discountPrice: hasDiscount ? Math.round(price * 0.8) : null,
    images: [
      `https://placehold.co/600x800?text=${encodeURIComponent(name)}`,
      `https://placehold.co/600x800?text=${encodeURIComponent(category)}+${index}`,
    ],
    category,
    stock: randomInt(0, 60),
    isActive: Math.random() > 0.1,
    size: t.sizeSet.map((size) => ({
      size,
      available: Math.random() > 0.2,
    })),
  };
}

async function seed(total = 100) {
  const base = Math.floor(total / CATEGORIES.length);
  const remainder = total - base * CATEGORIES.length;

  const products = [];
  CATEGORIES.forEach((category, catIndex) => {
    const count = base + (catIndex < remainder ? 1 : 0);
    for (let i = 0; i < count; i++) {
      products.push(buildProduct(category, i + 1));
    }
  });

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected. Inserting ${products.length} products...`);

  // Uncomment if you want to wipe existing products before seeding:
  // await Product.deleteMany({});

  const inserted = await Product.insertMany(products);
  console.log(
    `Inserted ${inserted.length} products across: ${CATEGORIES.join(", ")}`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
