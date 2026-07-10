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
import DeliveryBoyList from "./component/DeliveryBoy/DeliveryBoyList";
import AddDeliveryBoy from "./component/DeliveryBoy/AddDeliveryBoy";
import EditDeliveryBoy from "./component/DeliveryBoy/EditDeliveryBoy";
import DeliveryBoyDetails from "./component/DeliveryBoy/DeliveryBoyDetails";
import Login from "./component/DeliveryPatner/Login";
import DeliveryLayout from "./component/DeliveryPatner/Layout";
import Dashboard from "./component/DeliveryPatner/Dashboard";
import AssignedOrders from "./component/DeliveryPatner/AssignedOrders";
import DeliveryOrderDetails from "./component/DeliveryPatner/OrderDetails";
import History from "./component/DeliveryPatner/History";
import Profile from "./component/DeliveryPatner/Profile";
import ChangePassword from "./component/DeliveryPatner/ChangePassword";
import Checkout from "./component/Payment/Checkout";
import AddressForm from "./component/Payment/AddressForm";
import CustomerOrderDetails from "./component/CustomerOrders/CustomerOrderDetails";
import OrderSuccess from "./component/Payment/OrderSuccess";
import ReturnRequests from "./component/OrdersList/ReturnRequests/ReturnRequests";
import ApprovedReturns from "./component/OrdersList/ReturnRequests/ApprovedReturns";
import ShopDashboard from "./component/ShopDashboard/Dashboard/Dashboard";

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
        <Route path="dashboard" element={<ShopDashboard />} />
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
        // Delivery Boy Verification
        <Route
          path="deliveryBoy"
          element={
            <RoleProtectedRoute role="shop">
              <DeliveryBoyList />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="deliveryBoy/add"
          element={
            <RoleProtectedRoute role="shop">
              <AddDeliveryBoy />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="deliveryBoy/edit/:id"
          element={
            <RoleProtectedRoute role="shop">
              <EditDeliveryBoy />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="deliveryBoy/:id"
          element={
            <RoleProtectedRoute role="shop">
              <DeliveryBoyDetails />
            </RoleProtectedRoute>
          }
        />
        <Route path="returns" element={<ReturnRequests />} />
        <Route path="returns/approved" element={<ApprovedReturns />} />
      </Route>
      // Customer
      <Route path="customer" element={<LayoutDGFlake />}>
        <Route
          index
          element={
            <RoleProtectedRoute role="customer">
              <CustomerProducts />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <RoleProtectedRoute role="customer">
              <CustomerOrders />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <RoleProtectedRoute role="customer">
              <Checkout />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="address/add"
          element={
            <RoleProtectedRoute role="customer">
              <AddressForm />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="address/edit/:id"
          element={
            <RoleProtectedRoute role="customer">
              <AddressForm />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="order-success"
          element={
            <RoleProtectedRoute role="customer">
              <OrderSuccess />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="orders/:id"
          element={
            <RoleProtectedRoute role="customer">
              <CustomerOrderDetails />
            </RoleProtectedRoute>
          }
        />
      </Route>
      // Delivery Partenr
      <Route
        path="delivery"
        element={
          <RoleProtectedRoute role="deliveryPartner">
            <DeliveryLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<AssignedOrders />} />
        <Route path="orders/:id" element={<DeliveryOrderDetails />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
