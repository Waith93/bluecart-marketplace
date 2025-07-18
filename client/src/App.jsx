import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductCategories from "./pages/ProductCategories"; //  Added import
import UserProfileDashboard from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import SearchBarComponent from "./pages/SearchBarPage"; 

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
            <Route path="/Login" element={<LoginForm/>} />
            <Route path="/Signup" element={<SignupForm/>} />
            <Route path="/search" element={<SearchBarComponent />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App
