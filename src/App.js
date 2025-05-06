import { HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <HashRouter>
      <div
        className="relative min-h-screen bg-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/full-field.jpg)`,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay for contrast if needed */}
        <div className="relative z-10">
          <Navbar />
          <AppRoute />
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
