import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InitialLoader from "./components/InitialLoader";
import RequireAdmin from "./components/admin/RequireAdmin";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Contact from "./pages/Contact";
import LegalPage from "./components/pageDesign/LegalPage";
import { privacyContent, termsContent, warrantyContent } from "./data/legalContent";
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import Quotes from "./pages/admin/Quotes";
import Projects from "./pages/admin/Projects";
import QuoteDetail from "./pages/admin/QuoteDetail";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import ProjectEditor from "./pages/admin/ProjectEditor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/:slug" element={<MaterialDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<LegalPage content={privacyContent} />} />
            <Route path="/terms" element={<LegalPage content={termsContent} />} />
            <Route path="/warranty" element={<LegalPage content={warrantyContent} />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="quotes/:id" element={<QuoteDetail />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/:id" element={<ProjectEditor />} />
              <Route path="materials" element={<AdminPlaceholder title="Materials" />} />
              <Route path="services" element={<AdminPlaceholder title="Services" />} />
              <Route path="testimonials" element={<AdminPlaceholder title="Testimonials" />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <InitialLoader />
    </>
  );
}

export default App;
