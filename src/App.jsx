import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ All lazy imports
const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazy(() => import("./pages/auth/forgot-password2"));
const Error = lazy(() => import("./pages/404"));
const Profile = lazy(() => import("./pages/utility/profile"));
const Users = lazy(() => import("./pages/users"));
const AddUser = lazy(() => import("./pages/users/AddUser"));
const EditUser = lazy(() => import("./pages/users/EditUser"));
const Customer = lazy(() => import("./pages/customer/Index"));
const AddCustomer = lazy(() => import("./pages/customer/AddCustomer"));
const EditCustomer = lazy(() => import("./pages/customer/EditCustomer"));
const Quote = lazy(() => import("./pages/quote/Index"));
const AddQuote = lazy(() => import("./pages/quote/AddQuote"));
const EditQuote = lazy(() => import("./pages/quote/EditQuote"));
const ViewQuoteAdmin = lazy(() => import("./pages/quote/ViewQuoteAdmin"));
const QuoteView = lazy(() => import("./pages/quote/QuoteView"));
const TermsAndConditions = lazy(() => import("./pages/termsAndConditions"));
const Install = lazy(() => import("./pages/install/Index"));
const Product = lazy(() => import("./pages/product/Index"));
const AddProduct = lazy(() => import("./pages/product/AddProduct"));
const EditProduct = lazy(() => import("./pages/product/EditProduct"));
const Invoice = lazy(() => import("./pages/invoice/Index"));
const InvoiceView = lazy(() => import("./pages/invoice/InvoiceView"));

// ✅ Keep these as normal imports (not lazy - they are layout/utility components)
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const ADMIN_ONLY = [1];
const SALES_AND_ADMIN = [1, 4];

function App() {
  return (
    <main className="App relative">
      {/* ✅ Wrap all Routes in Suspense */}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/forgot-password2" element={<ForgotPass2 />} />
          </Route>

          <Route path="/*" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />

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

            <Route
              path="install"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Install />
                </ProtectedRoute>
              }
            />

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

            <Route
              path="invoice"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Invoice />
                </ProtectedRoute>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Route>

          <Route
            path="users/quote_final_invoice/:id"
            element={<InvoiceView />}
          />
          <Route path="users/quote_invoice/:id" element={<QuoteView />} />
          <Route
            path="quote/termsconditions"
            element={<TermsAndConditions />}
          />
          <Route path="/404" element={<Error />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
