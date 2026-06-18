import { Routes, Route } from "react-router-dom";
import Missing from "./missing";
import ProductUi from "./component/products/productUi";
import CategoriesList from "./component/categories/categoriesList";
import AddNewProduct from "./component/products/addNewProduct";
import LayoutDGFlake from "./component/LayoutDGFlake";
import Layout from "./component/layout";
import ForgotPassword from "./component/forgotpassword";
import LoginUi from "./component/login";
import HomeMenu from "./component/home/HomeMenu";
import AddNewCategory from "./component/categories/addNewCategory";
import VerifyOtp from "./component/otp/otp";
import Register from "./component/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginUi />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="verify-otp" element={<VerifyOtp />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="dgflake" element={<LayoutDGFlake />}>
        <Route index element={<HomeMenu />} />
        <Route path="categories/*" element={<CategoriesList />} />
        <Route path="categories/addcategories" element={<AddNewCategory />} />
        <Route
          path="categories/addcategories/:id"
          element={<AddNewCategory />}
        />
        <Route path="products/*" element={<ProductUi />} />
        <Route path="products/addproducts" element={<AddNewProduct />} />
        <Route path="products/addproducts/:id" element={<AddNewProduct />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
