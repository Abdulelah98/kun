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

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Bookings from "@/pages/admin/Bookings";
import Messages from "@/pages/admin/Messages";
import Offices from "@/pages/admin/Offices";
import MeetingRooms from "@/pages/admin/MeetingRooms";
import SharedDesks from "@/pages/admin/SharedDesks";
import Content from "@/pages/admin/Content";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";
import Availability from "@/pages/admin/Availability";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Branding from "@/pages/admin/Branding";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <div dir="rtl" lang="ar" className="font-cairo">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <BrandingProvider>
          <AuthProvider>
            <ContentProvider>
              <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/spaces" element={<PublicLayout><SpacesPage /></PublicLayout>} />
            <Route path="/business" element={<PublicLayout><BusinessPage /></PublicLayout>} />
            <Route path="/pod" element={<PublicLayout><PodPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="availability" element={<Availability />} />
              <Route path="messages" element={<Messages />} />
              <Route path="offices" element={<Offices />} />
              <Route path="meeting-rooms" element={<MeetingRooms />} />
              <Route path="shared-desks" element={<SharedDesks />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="content" element={<Content />} />
              <Route path="branding" element={<Branding />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
          <Toaster position="top-center" dir="rtl" />
            </ContentProvider>
          </AuthProvider>
        </BrandingProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
