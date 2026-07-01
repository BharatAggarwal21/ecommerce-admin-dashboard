const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randomInt(0, arr.length - 1)];

const categoryData = [
  { name: "Electronics", description: "Phones, laptops, gadgets" },
  { name: "Fashion", description: "Clothing and accessories" },
  { name: "Shoes", description: "Footwear for all occasions" },
  { name: "Books", description: "Fiction, non-fiction, and more" },
  { name: "Home & Kitchen", description: "Appliances and home essentials" },
];

const productNames = {
  Electronics: ["iPhone 15", "Samsung Galaxy S24", "Dell XPS 13 Laptop", "Sony WH-1000XM5", "iPad Air", "OnePlus 12"],
  Fashion: ["Denim Jacket", "Cotton T-Shirt", "Wool Sweater", "Linen Shirt", "Formal Blazer"],
  Shoes: ["Nike Air Max", "Adidas Ultraboost", "Puma Runner", "Formal Leather Shoes", "Sports Sandals"],
  Books: ["Atomic Habits", "The Pragmatic Programmer", "Clean Code", "Sapiens", "Deep Work"],
  "Home & Kitchen": ["Air Fryer", "Blender", "Non-stick Cookware Set", "Vacuum Cleaner", "Coffee Maker"],
};

const customerNames = [
  "John Carter", "Alex Johnson", "Mark Wilson", "Priya Sharma", "Rahul Verma",
  "Emma Davis", "Liam Brown", "Olivia Smith", "Noah Taylor", "Sophia Martin",
  "William Anderson", "Ava Thomas", "James Jackson", "Isabella White", "Ethan Harris",
];

const statuses = ["Pending", "Processing", "Delivered", "Cancelled"];
const statusWeights = [0.2, 0.15, 0.55, 0.1];

const weightedStatus = () => {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < statuses.length; i += 1) {
    acc += statusWeights[i];
    if (r <= acc) return statuses[i];
  }
  return statuses[statuses.length - 1];
};

const randomPastDate = (daysBack) => {
  const now = Date.now();
  const past = now - randomInt(0, daysBack) * 24 * 60 * 60 * 1000 - randomInt(0, 23) * 60 * 60 * 1000;
  return new Date(past);
};

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Order.deleteMany({}),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: "Admin",
    email: "admin@ecommdash.com",
    password: "Admin@123",
    role: "admin",
  });

  console.log("Creating categories...");
  const categories = await Category.insertMany(categoryData);

  console.log("Creating products...");
  const productDocs = [];
  categories.forEach((cat) => {
    const names = productNames[cat.name] || [];
    names.forEach((name) => {
      productDocs.push({
        name,
        price: randomInt(15, 1500) * 10,
        stock: randomInt(0, 200),
        category: cat._id,
        sold: randomInt(0, 300),
        description: `${name} - premium quality, available in ${cat.name.toLowerCase()}.`,
      });
    });
  });
  const products = await Product.insertMany(productDocs);

  console.log("Creating customers...");
  const customers = await Customer.insertMany(
    customerNames.map((name, i) => ({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: `9${randomInt(100000000, 999999999)}`,
    }))
  );

  console.log("Creating orders...");
  const orderDocs = [];
  for (let i = 0; i < 120; i += 1) {
    const customer = pick(customers);
    const itemCount = randomInt(1, 3);
    const chosenProducts = new Set();
    while (chosenProducts.size < itemCount) chosenProducts.add(pick(products));

    const items = [...chosenProducts].map((p) => ({
      product: p._id,
      name: p.name,
      price: p.price,
      quantity: randomInt(1, 3),
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orderDocs.push({
      customer: customer._id,
      items,
      total,
      status: weightedStatus(),
      createdAt: randomPastDate(30),
    });
  }
  await Order.insertMany(orderDocs);

  console.log("\nSeed complete!");
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Products:   ${products.length}`);
  console.log(`  Customers:  ${customers.length}`);
  console.log(`  Orders:     ${orderDocs.length}`);
  console.log("\nAdmin login:");
  console.log("  email: admin@ecommdash.com");
  console.log("  password: Admin@123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
