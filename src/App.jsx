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

// Inventory Module
const Inventory = lazy(() => import("./pages/inventory/Index"));
const TrackList = lazy(() => import("./pages/inventory/tracks/TrackList"));
const ScrewList = lazy(() => import("./pages/inventory/screws/ScrewList"));
const ControllerList = lazy(() => import("./pages/inventory/controllers/ControllerList"));
const BoostBoxList = lazy(() => import("./pages/inventory/boost/BoostBoxList"));
const ConnectorList = lazy(() => import("./pages/inventory/connectors/ConnectorList"));
const LightList = lazy(() => import("./pages/inventory/lights/LightList"));
const CableList = lazy(() => import("./pages/inventory/cables/CableList"));
const JumperList = lazy(() => import("./pages/inventory/jumpers/JumperList"));
const PlugList = lazy(() => import("./pages/inventory/plugs/PlugList"));
const PowerCordList = lazy(() => import("./pages/inventory/powercord/PowerCordList"));
const AddTrack = lazy(() => import("./pages/inventory/tracks/AddTrack"));
const EditTrack = lazy(() => import("./pages/inventory/tracks/EditTrack"));
const AddScrew = lazy(() => import("./pages/inventory/screws/AddScrew"));
const EditScrew = lazy(() => import("./pages/inventory/screws/EditScrew"));
const AddController = lazy(() => import("./pages/inventory/controllers/AddController"));
const EditController = lazy(() => import("./pages/inventory/controllers/EditController"));
const AddBoostBox = lazy(() => import("./pages/inventory/boost/AddBoostBox"));
const EditBoostBox = lazy(() => import("./pages/inventory/boost/EditBoostBox"));
const AddConnector = lazy(() => import("./pages/inventory/connectors/AddConnector"));
const EditConnector = lazy(() => import("./pages/inventory/connectors/EditConnector"));
const AddLight = lazy(() => import("./pages/inventory/lights/AddLight"));
const EditLight = lazy(() => import("./pages/inventory/lights/EditLight"));
const AddCable = lazy(() => import("./pages/inventory/cables/AddCable"));
const EditCable = lazy(() => import("./pages/inventory/cables/EditCable"));
const AddJumper = lazy(() => import("./pages/inventory/jumpers/AddJumper"));
const EditJumper = lazy(() => import("./pages/inventory/jumpers/EditJumper"));
const AddPlug = lazy(() => import("./pages/inventory/plugs/AddPlug"));
const EditPlug = lazy(() => import("./pages/inventory/plugs/EditPlug"));
const AddPowerCord = lazy(() => import("./pages/inventory/powercord/AddPowerCord"));
const EditPowerCord = lazy(() => import("./pages/inventory/powercord/EditPowerCord"));

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

            {/* Inventory Module */}
            <Route
              path="inventory"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route path="inventory">






              <Route
                path="tracks"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <TrackList />
                  </ProtectedRoute>
                }
              />


              <Route
                path="tracks/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddTrack />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tracks/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditTrack />
                  </ProtectedRoute>
                }
              />
              <Route
                path="screws"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <ScrewList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="screws/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddScrew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="screws/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditScrew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="controllers"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <ControllerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="controllers/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddController />
                  </ProtectedRoute>
                }
              />
              <Route
                path="controllers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditController />
                  </ProtectedRoute>
                }
              />
              <Route
                path="boost"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <BoostBoxList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="boost/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddBoostBox />
                  </ProtectedRoute>
                }
              />
              <Route
                path="boost/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditBoostBox />
                  </ProtectedRoute>
                }
              />
              <Route
                path="connectors"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <ConnectorList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="connectors/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddConnector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="connectors/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditConnector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="lights"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <LightList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="lights/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddLight />
                  </ProtectedRoute>
                }
              />
              <Route
                path="lights/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditLight />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cables"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <CableList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cables/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddCable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cables/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditCable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jumpers"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <JumperList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="jumpers/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddJumper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jumpers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditJumper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="plugs"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <PlugList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="plugs/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddPlug />
                  </ProtectedRoute>
                }
              />
              <Route
                path="plugs/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditPlug />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powercord"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <PowerCordList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powercord/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddPowerCord />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powercord/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <EditPowerCord />
                  </ProtectedRoute>
                }
              />
            </Route>

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
