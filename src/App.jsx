import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Helper: Auto-reload on failed dynamic import (fixes stale chunk errors after deployment)
const lazyRetry = (componentImport) => {
  return lazy(() =>
    componentImport().catch((error) => {
      // Check if we've already tried reloading to prevent infinite loops
      const hasReloaded = sessionStorage.getItem("retry-lazy-refreshed");
      if (!hasReloaded) {
        sessionStorage.setItem("retry-lazy-refreshed", "true");
        window.location.reload();
        return; // will reload before this resolves
      }
      sessionStorage.removeItem("retry-lazy-refreshed");
      throw error; // if reload didn't fix it, throw the original error
    })
  );
};

// ✅ All lazy imports (with auto-retry on chunk load failure)
const Dashboard = lazyRetry(() => import("./pages/dashboard"));
const Login = lazyRetry(() => import("./pages/auth/login"));
const ForgotPass = lazyRetry(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazyRetry(() => import("./pages/auth/forgot-password2"));
const Error = lazyRetry(() => import("./pages/404"));
const Profile = lazyRetry(() => import("./pages/utility/profile"));
const Users = lazyRetry(() => import("./pages/users"));
const AddUser = lazyRetry(() => import("./pages/users/AddUser"));
const EditUser = lazyRetry(() => import("./pages/users/EditUser"));
const Customer = lazyRetry(() => import("./pages/customer/Index"));
const AddCustomer = lazyRetry(() => import("./pages/customer/AddCustomer"));
const EditCustomer = lazyRetry(() => import("./pages/customer/EditCustomer"));
const Quote = lazyRetry(() => import("./pages/quote/Index"));
const AddQuote = lazyRetry(() => import("./pages/quote/AddQuote"));
const EditQuote = lazyRetry(() => import("./pages/quote/EditQuote"));
const ViewQuoteAdmin = lazyRetry(() => import("./pages/quote/ViewQuoteAdmin"));
const QuoteView = lazyRetry(() => import("./pages/quote/QuoteView"));
const TermsAndConditions = lazyRetry(() => import("./pages/termsAndConditions"));
const Install = lazyRetry(() => import("./pages/install/Index"));
const CalendarView = lazyRetry(() => import("./pages/install/CalendarView"));
const InstallationProcess = lazyRetry(() => import("./pages/install/InstallationProcess"));
const Product = lazyRetry(() => import("./pages/product/Index"));
const AddProduct = lazyRetry(() => import("./pages/product/AddProduct"));
const EditProduct = lazyRetry(() => import("./pages/product/EditProduct"));
const Invoice = lazyRetry(() => import("./pages/invoice/Index"));
const InvoiceView = lazyRetry(() => import("./pages/invoice/InvoiceView"));

// Inventory Module
const Inventory = lazyRetry(() => import("./pages/inventory/Index"));
const TrackList = lazyRetry(() => import("./pages/inventory/tracks/TrackList"));
const ScrewList = lazyRetry(() => import("./pages/inventory/screws/ScrewList"));
const ControllerList = lazyRetry(() => import("./pages/inventory/controllers/ControllerList"));
const ConnectorList = lazyRetry(() => import("./pages/inventory/connectors/ConnectorList"));
const LightList = lazyRetry(() => import("./pages/inventory/lights/LightList"));
const CableList = lazyRetry(() => import("./pages/inventory/cables/CableList"));
const JumperList = lazyRetry(() => import("./pages/inventory/jumpers/JumperList"));
const PlugList = lazyRetry(() => import("./pages/inventory/plugs/PlugList"));
const PowerCordList = lazyRetry(() => import("./pages/inventory/powercord/PowerCordList"));
const AddTrack = lazyRetry(() => import("./pages/inventory/tracks/AddTrack"));
const EditTrack = lazyRetry(() => import("./pages/inventory/tracks/EditTrack"));
const AddScrew = lazyRetry(() => import("./pages/inventory/screws/AddScrew"));
const EditScrew = lazyRetry(() => import("./pages/inventory/screws/EditScrew"));
const AddController = lazyRetry(() => import("./pages/inventory/controllers/AddController"));
const EditController = lazyRetry(() => import("./pages/inventory/controllers/EditController"));
const AddConnector = lazyRetry(() => import("./pages/inventory/connectors/AddConnector"));
const EditConnector = lazyRetry(() => import("./pages/inventory/connectors/EditConnector"));
const AddLight = lazyRetry(() => import("./pages/inventory/lights/AddLight"));
const EditLight = lazyRetry(() => import("./pages/inventory/lights/EditLight"));
const AddCable = lazyRetry(() => import("./pages/inventory/cables/AddCable"));
const EditCable = lazyRetry(() => import("./pages/inventory/cables/EditCable"));
const AddJumper = lazyRetry(() => import("./pages/inventory/jumpers/AddJumper"));
const EditJumper = lazyRetry(() => import("./pages/inventory/jumpers/EditJumper"));
const AddPlug = lazyRetry(() => import("./pages/inventory/plugs/AddPlug"));
const EditPlug = lazyRetry(() => import("./pages/inventory/plugs/EditPlug"));
const AddPowerCord = lazyRetry(() => import("./pages/inventory/powercord/AddPowerCord"));
const EditPowerCord = lazyRetry(() => import("./pages/inventory/powercord/EditPowerCord"));
const OutercaseList = lazyRetry(() => import("./pages/inventory/outercases/OutercaseList"));
const AddOutercase = lazyRetry(() => import("./pages/inventory/outercases/AddOutercase"));
const EditOutercase = lazyRetry(() => import("./pages/inventory/outercases/EditOutercase"));
const AppcontrollerList = lazyRetry(() => import("./pages/inventory/appcontrollers/AppcontrollerList"));
const AddAppcontroller = lazyRetry(() => import("./pages/inventory/appcontrollers/AddAppcontroller"));
const EditAppcontroller = lazyRetry(() => import("./pages/inventory/appcontrollers/EditAppcontroller"));
const PowersupplyList = lazyRetry(() => import("./pages/inventory/powersupplies/PowersupplyList"));
const AddPowersupply = lazyRetry(() => import("./pages/inventory/powersupplies/AddPowersupply"));
const EditPowersupply = lazyRetry(() => import("./pages/inventory/powersupplies/EditPowersupply"));

// Reports Module
const Reports = lazyRetry(() => import("./pages/reports/Index"));

// ✅ Keep these as normal imports (not lazy - they are layout/utility components)
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const ADMIN_ONLY = [1];
const SALES_AND_ADMIN = [1, 4];
const ADMIN_AND_INSTALLER = [1, 2];
const ALL_ROLES = [1, 2, 3, 4];

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

            <Route path="install">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <Install />
                  </ProtectedRoute>
                }
              />
              <Route
                path="calendar"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_AND_INSTALLER}>
                    <CalendarView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="process/:id"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_AND_INSTALLER}>
                    <InstallationProcess />
                  </ProtectedRoute>
                }
              />
            </Route>

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
                <ProtectedRoute allowedRoles={ALL_ROLES}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route path="inventory">






              <Route
                path="tracks"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditTrack />
                  </ProtectedRoute>
                }
              />
              <Route
                path="screws"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditScrew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="controllers"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditController />
                  </ProtectedRoute>
                }
              />

              <Route
                path="connectors"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditConnector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="lights"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditLight />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cables"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditCable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jumpers"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditJumper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="plugs"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditPlug />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powercord"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
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
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditPowerCord />
                  </ProtectedRoute>
                }
              />
              <Route
                path="outercases"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <OutercaseList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="outercases/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddOutercase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="outercases/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditOutercase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="appcontrollers"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <AppcontrollerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="appcontrollers/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddAppcontroller />
                  </ProtectedRoute>
                }
              />
              <Route
                path="appcontrollers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditAppcontroller />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powersupplies"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <PowersupplyList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powersupplies/add"
                element={
                  <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                    <AddPowersupply />
                  </ProtectedRoute>
                }
              />
              <Route
                path="powersupplies/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <EditPowersupply />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Reports Module */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <Reports />
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
