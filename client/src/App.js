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
import RoleProtectedRoute from "./component/ProtectedRoutes/RoleProtectedRoute";
import OrdersList from "./component/OrdersList/OrdersList ";
import BrandUi from "./component/BrandsList/BrandUi";
import AddNewBrand from "./component/BrandsList/AddNewBrand";
import OrderDetails from "./component/OrdersList/OrderDetails";
import CustomerProducts from "./component/Shopping/Shopping";
import CustomerOrders from "./component/CustomerOrders/CustomerOrders";

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
        <Route
          path="categories"
          element={
            <RoleProtectedRoute role="shop">
              <CategoriesList />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="categories/addcategories"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewCategory />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="categories/addcategories/:id"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewCategory />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="products"
          element={
            <RoleProtectedRoute role="shop">
              <ProductUi />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="products/addproducts"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewProduct />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="products/addproducts/:id"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewProduct />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="brands"
          element={
            <RoleProtectedRoute role="shop">
              <BrandUi />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="brands/addbrand"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewBrand />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="brands/addbrand/:id"
          element={
            <RoleProtectedRoute role="shop">
              <AddNewBrand />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <RoleProtectedRoute role="shop">
              <OrdersList />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <RoleProtectedRoute role="shop">
              <OrderDetails />
            </RoleProtectedRoute>
          }
        />

        <Route path="shop" element={<CustomerProducts />} />
        <Route path="cart" element={<CustomerOrders />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
