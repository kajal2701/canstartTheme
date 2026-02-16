import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Dashboard = lazy(() => import("./pages/dashboard"));

const Login = lazy(() => import("./pages/auth/login"));

const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazy(() => import("./pages/auth/forgot-password2"));
const Error = lazy(() => import("./pages/404"));

import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
import AuthLayout from "./layout/AuthLayout";
import Users from "./pages/users";
import AddUser from "./pages/users/AddUser";
import Customer from "./pages/customer/Index";
import AddCustomer from "./pages/customer/AddCustomer";
import Quote from "./pages/quote/Index";
import AddQuote from "./pages/quote/AddQuote";
import Install from "./pages/install/Index";
import Product from "./pages/product/Index";
import AddProduct from "./pages/product/AddProduct";
import Invoice from "./pages/invoice/Index";

function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/forgot-password2" element={<ForgotPass2 />} />
        </Route>

        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="add" element={<AddUser />} />
          </Route>

          <Route path="customer">
            <Route index element={<Customer />} />
            <Route path="add" element={<AddCustomer />} />
          </Route>

          <Route path="quote">
            <Route index element={<Quote />} />
            <Route path="add" element={<AddQuote />} />
          </Route>

          <Route path="install" element={<Install />} />

          <Route path="product">
            <Route index element={<Product />} />
            <Route path="add" element={<AddProduct />} />
          </Route>

          <Route path="invoice" element={<Invoice />} />

          <Route path="*" element={<Navigate to="/404" />} />
        </Route>
        <Route
          path="/404"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
