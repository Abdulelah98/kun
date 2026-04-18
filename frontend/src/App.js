import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import SpacesPage from "@/pages/SpacesPage";
import BusinessPage from "@/pages/BusinessPage";
import PodPage from "@/pages/PodPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div dir="rtl" lang="ar" className="font-cairo">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/pod" element={<PodPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
        <Toaster position="top-center" dir="rtl" />
      </BrowserRouter>
    </div>
  );
}

export default App;
