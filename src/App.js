import { HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <HashRouter>
      {/* ✅ Wrap everything in a full-screen container with the background */}
      <div
        className="relative min-h-screen flex flex-col bg-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/full-field.jpg)`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover", // ✅ Ensure image covers the screen
          backgroundPosition: "center", // ✅ Keep it centered
        }}
      >
        {/* ✅ Content Section */}
        <div className="relative z-10 flex-grow">
          <Navbar />
          <AppRoute />
        </div>
        
        {/* ✅ Footer Stays at Bottom */}
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;