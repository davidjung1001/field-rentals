import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AddField from "../pages/AddField";
import FieldDetails from "../pages/FieldDetails";
import AddAvailability from "../pages/AddAvailability"; 
import BookField from "../pages/BookField"; 
import Login from "../pages/Login";
import Navbar from "../components/Navbar"; // ✅ Ensure Navbar is imported
import Register from "../pages/Register";
import ProfileListings from "../pages/ProfileListings";
import MyBookings from "../pages/MyBookings";
import EditField from "../components/EditField";
import ForgotPassword from "../pages/ForgotPassword";
import PickupSoccer from "../pages/PickupSoccer";
import HostPickupGame from "../pages/HostPickupGame";
import PickupGameDetails from "../pages/PickupGameDetails";
import PickupChat from "../components/PickupChat";

const AppRoute = () => {
  return (
    <div className="pt-11"> {/* ✅ Pushes ALL pages below the fixed Navbar */}
      <Navbar /> {/* ✅ Ensures Navbar is always visible */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/pickup-soccer" element={<PickupSoccer />} />
        <Route path="/host-pickup-game" element={<HostPickupGame />} />
        <Route path="/field/:id" element={<FieldDetails />} />
        <Route path="/pickup-game/:gameId" element={<PickupGameDetails />} />
        <Route path="/pickup-chat" element={<PickupChat />} />
        <Route path="/my-bookings" element={<MyBookings />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/edit-field/:fieldId" element={<EditField />} />
        <Route path="/add-availability/:fieldId" element={<AddAvailability />} />
        <Route path="/profile/:uid" element={<ProfileListings />} />
        <Route path="/book-field/:fieldId" element={<BookField />} />
      </Routes>
    </div>
  );
};

export default AppRoute;
