import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";

function App() {
  return (
    <Router>
      <Navbar />  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
