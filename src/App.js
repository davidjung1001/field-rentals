import { HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <HashRouter> {/* ✅ Use HashRouter instead of BrowserRouter */}
      <Navbar />
      <div className="min-h-screen">
        <AppRoute />
      </div>
      <Footer />
    </HashRouter>
  );
}

export default App;