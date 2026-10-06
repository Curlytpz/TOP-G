import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/motion/PageTransition";

function PublicLayout() {
  return <div className="min-h-screen overflow-x-clip bg-black text-white"><Navbar /><main><PageTransition><Outlet /></PageTransition></main><Footer /></div>;
}

export default PublicLayout;