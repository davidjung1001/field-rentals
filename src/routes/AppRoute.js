import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AddField from "../pages/AddField";
import FieldDetails from "../pages/FieldDetails";
import Login from "../pages/Login"; // ✅ Import Login page

const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-field" element={<AddField />} />
      <Route path="/field/:id" element={<FieldDetails />} />
      <Route path="/login" element={<Login />} /> {/* ✅ Added login route */}
    </Routes>
  );
};

export default AppRoute;