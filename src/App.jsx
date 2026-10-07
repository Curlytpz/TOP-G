import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InitialLoader from "./components/InitialLoader";
import RequireAdmin from "./components/admin/RequireAdmin";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import { privacyContent, termsContent, warrantyContent } from "./data/legalContent";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Materials = lazy(() => import("./pages/Materials"));
const MaterialDetail = lazy(() => import("./pages/MaterialDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Quote = lazy(() => import("./pages/Quote"));
const Contact = lazy(() => import("./pages/Contact"));
const LegalPage = lazy(() => import("./components/pageDesign/LegalPage"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Quotes = lazy(() => import("./pages/admin/Quotes"));
const Projects = lazy(() => import("./pages/admin/Projects"));
const QuoteDetail = lazy(() => import("./pages/admin/QuoteDetail"));
const AdminPlaceholder = lazy(() => import("./pages/admin/AdminPlaceholder"));
const ProjectEditor = lazy(() => import("./pages/admin/ProjectEditor"));

function RouteFallback() {
  return <div className="min-h-[24rem]" aria-live="polite" aria-label="Loading page" />;
}

function DeferredPage({ Page, ...props }) {
  return <Suspense fallback={<RouteFallback />}><Page {...props} /></Suspense>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<DeferredPage Page={Home} />} />
            <Route path="/services" element={<DeferredPage Page={Services} />} />
            <Route path="/materials" element={<DeferredPage Page={Materials} />} />
            <Route path="/materials/:slug" element={<DeferredPage Page={MaterialDetail} />} />
            <Route path="/gallery" element={<DeferredPage Page={Gallery} />} />
            <Route path="/gallery/:id" element={<DeferredPage Page={ProjectDetail} />} />
            <Route path="/about" element={<DeferredPage Page={About} />} />
            <Route path="/quote" element={<DeferredPage Page={Quote} />} />
            <Route path="/contact" element={<DeferredPage Page={Contact} />} />
            <Route path="/privacy" element={<DeferredPage Page={LegalPage} content={privacyContent} />} />
            <Route path="/terms" element={<DeferredPage Page={LegalPage} content={termsContent} />} />
            <Route path="/warranty" element={<DeferredPage Page={LegalPage} content={warrantyContent} />} />
          </Route>
          <Route path="/admin/login" element={<DeferredPage Page={AdminLogin} />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DeferredPage Page={Dashboard} />} />
              <Route path="quotes" element={<DeferredPage Page={Quotes} />} />
              <Route path="quotes/:id" element={<DeferredPage Page={QuoteDetail} />} />
              <Route path="projects" element={<DeferredPage Page={Projects} />} />
              <Route path="projects/new" element={<DeferredPage Page={ProjectEditor} />} />
              <Route path="projects/:id" element={<DeferredPage Page={ProjectEditor} />} />
              <Route path="materials" element={<DeferredPage Page={AdminPlaceholder} title="Materials" />} />
              <Route path="services" element={<DeferredPage Page={AdminPlaceholder} title="Services" />} />
              <Route path="testimonials" element={<DeferredPage Page={AdminPlaceholder} title="Testimonials" />} />
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
