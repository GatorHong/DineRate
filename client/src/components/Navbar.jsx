import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/feed" className="hover:underline">Feed</Link>
      <Link to="/profile" className="hover:underline">Profile</Link>
    </nav>
  );
}
