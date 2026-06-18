import { configureStore } from "@reduxjs/toolkit";
import categoryData from "../slice/categorySlice";
import productData from "../slice/productSlice";
const store = configureStore({
    reducer:{
        categoryData:categoryData,
        productData:productData,
    }
})
export default store;