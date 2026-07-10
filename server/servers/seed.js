import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo Connected");

    // clean old data

    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();

    const category = await Category.create({
      name: "Grocery",
      description: "Daily needs",
      categoryCode: "CAT001",
    });

    const brand = await Brand.create({
      name: "Amul",
    });

    await Product.create({
      name: "Amul Milk",

      category: category._id,

      brand: brand._id,

      mrp: 70,

      packSize: "1 L",

      status: true,
    });

    console.log("Seed completed");

    process.exit();
  } catch (err) {
    console.log(err);

    process.exit(1);
  }
};

seedData();
