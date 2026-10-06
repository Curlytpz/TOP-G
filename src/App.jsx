import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import InitialLoader from "./components/InitialLoader";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Materials from "./pages/Materials";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";

function LocalAdminOnly() {
  const host = typeof window === "undefined" ? "" : window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  return isLocal ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return <><BrowserRouter><Routes><Route element={<PublicLayout />}><Route path="/" element={<Home />} /><Route path="/services" element={<Services />} /><Route path="/materials" element={<Materials />} /><Route path="/gallery" element={<Gallery />} /><Route path="/about" element={<About />} /><Route path="/quote" element={<Quote />} /><Route path="/contact" element={<Contact />} /></Route><Route element={<LocalAdminOnly />}><Route path="/admin" element={<AdminLayout />}><Route index element={<Dashboard />} /></Route></Route></Routes></BrowserRouter><InitialLoader /></>;
}

export default App;