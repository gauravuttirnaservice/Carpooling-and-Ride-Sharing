import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PageNotFound from "./pages/PageNotFound";

import DriverDashboardPage from "./pages/driverdashboardpages/DriverDashboardPage";
import OfferRidePage from "./pages/driverdashboardpages/OfferRidePage";
import PaymentHistoryPage from "./pages/driverdashboardpages/PaymentHistoryPage";
import ScheduleRidesPage from "./pages/driverdashboardpages/ScheduleRidesPage";
import UserDashboardPage from "./pages/userdashboardpages/UserDashboardPage";
import MyRidesPage from "./pages/userdashboardpages/MyRidesPage";
import UserPaymentHistoryPage from "./pages/userdashboardpages/UserPaymentHistoryPage";
import FindRidePage from "./pages/userdashboardpages/FindRidePage";
import RideDetailsPage from "./pages/userdashboardpages/RideDetailsPage";
import BookingConfirmationPage from "./pages/userdashboardpages/BookingConfirmationPage";
import AdminLayout from "./components/admindashboard/AdminLayout";
import AdminDashboardPage from "./pages/admindashboardpages/AdminDashboardPage";
import AdminUsersPage from "./pages/admindashboardpages/AdminUsersPage";
import AdminUserProfilePage from "./pages/admindashboardpages/AdminUserProfilePage";
import AdminRidesPage from "./pages/admindashboardpages/AdminRidesPage";
import AdminRideDetailPage from "./pages/admindashboardpages/AdminRideDetailPage";
import AdminBookingsPage from "./pages/admindashboardpages/AdminBookingsPage";
import AdminReviewsPage from "./pages/admindashboardpages/AdminReviewsPage";
import AdminSettingsPage from "./pages/admindashboardpages/AdminSettingsPage";
import ForgotPassword from "./pages/Forgot/ForgotPassword";

import "leaflet/dist/leaflet.css";


function App() {
  return (
    <BrowserRouter>
      {/* <Toaster /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Driver Dashboard Routes */}
        <Route path="/driverdashboard" element={<DriverDashboardPage />} />
        <Route path="/offer-ride" element={<OfferRidePage />} />
        <Route path="/scheduled-rides" element={<ScheduleRidesPage />} />
        <Route path="/payment-history" element={<PaymentHistoryPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Dashboard Routes */}
        <Route path="/my-profile" element={<UserDashboardPage />} />
        <Route path="/my-ride" element={<MyRidesPage />} />
        <Route path="/find-ride" element={<FindRidePage />} />
        <Route
          path="/user-payment-history"
          element={<UserPaymentHistoryPage />}
        />
        <Route path="/book-ride/:id" element={<RideDetailsPage />} />
        <Route path="/book-seat" element={<BookingConfirmationPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserProfilePage />} />
          <Route path="rides" element={<AdminRidesPage />} />
          <Route path="rides/:id" element={<AdminRideDetailPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Catch All non-existent routes */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;
