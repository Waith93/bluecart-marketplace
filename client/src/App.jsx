import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductCategories from "./pages/ProductCategories"; //  Added import
import UserProfileDashboard from "./pages/Profile";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Product Categories" element={<ProductCategories />} /> {/* Added route */}
            <Route path="/profile" element={<UserProfileDashboard />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App
