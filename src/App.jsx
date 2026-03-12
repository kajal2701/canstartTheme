import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazy(() => import("./pages/auth/forgot-password2"));
const Error = lazy(() => import("./pages/404"));

import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅
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
import ViewQuoteAdmin from "./pages/quote/ViewQuoteAdmin";
import EditUser from "./pages/users/EditUser";
import EditCustomer from "./pages/customer/EditCustomer";
import EditProduct from "./pages/product/EditProduct";
import InvoiceView from "./pages/invoice/InvoiceView";
import QuoteView from "./pages/quote/QuoteView";
import EditQuote from "./pages/quote/EditQuote";

const Profile = lazy(() => import("./pages/utility/profile"));

const ADMIN_ONLY = [1];
const SALES_AND_ADMIN = [1, 4];

function App() {
  return (
    <main className="App relative">
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/forgot-password2" element={<ForgotPass2 />} />
        </Route>

        <Route path="/*" element={<Layout />}>
          {/* Dashboard - all roles */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Users - admin only */}
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit_user/:id"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Customer - admin + sales */}
          <Route path="customer">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <Customer />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <AddCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit_customer/:id"
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Quote - admin + sales */}
          <Route path="quote">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <Quote />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <AddQuote />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit_quote/:id"
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <EditQuote />
                </ProtectedRoute>
              }
            />
            <Route
              path="view_quote_admin/:id"
              element={
                <ProtectedRoute allowedRoles={SALES_AND_ADMIN}>
                  <ViewQuoteAdmin />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Install - admin only */}
          <Route
            path="install"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                <Install />
              </ProtectedRoute>
            }
          />

          {/* Product - admin only */}
          <Route path="product">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit_product/:id"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Invoice - admin only */}
          <Route
            path="invoice"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                <Invoice />
              </ProtectedRoute>
            }
          />

          {/* Profile - all roles */}
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/404" />} />
        </Route>

        <Route path="users/quote_final_invoice/:id" element={<InvoiceView />} />
        <Route path="users/quote_invoice/:id" element={<QuoteView />} />
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
