import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import MyHotelBookings from "./pages/MyHotelBookings"; // Import MyHotelBookings
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        <Route
          path="/hotel/:hotelId/booking"
          element={(
            <ProtectedRoute allowedRoles={["guest", "hotel-owner"]}>
              <Layout>
                <Booking />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/add-hotel"
          element={(
            <ProtectedRoute allowedRoles={["hotel-owner"]}>
              <Layout>
                <AddHotel />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/edit-hotel/:hotelId"
          element={(
            <ProtectedRoute allowedRoles={["hotel-owner"]}>
              <Layout>
                <EditHotel />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/my-hotels"
          element={(
            <ProtectedRoute allowedRoles={["hotel-owner"]}>
              <Layout>
                <MyHotels />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/my-hotel-bookings" // New route for hotel owner bookings
          element={(
            <ProtectedRoute allowedRoles={["hotel-owner"]}>
              <Layout>
                <MyHotelBookings />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/my-bookings"
          element={(
            <ProtectedRoute allowedRoles={["guest"]}>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

