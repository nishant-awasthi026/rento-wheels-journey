
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OwnerDashboard from "./pages/owner/Dashboard";
import RenterDashboard from "./pages/renter/Dashboard";
import VehicleDetails from "./pages/VehicleDetails";
import VehicleSearch from "./pages/VehicleSearch";
import OwnerVehicles from "./pages/owner/Vehicles";
import MyBookings from "./pages/renter/MyBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/vehicles" element={<OwnerVehicles />} />
            <Route path="/owner/vehicles/new" element={<OwnerVehicles />} />
            <Route path="/owner/vehicles/:id/edit" element={<OwnerVehicles />} />
            <Route path="/owner/vehicles/:id/calendar" element={<OwnerVehicles />} />
            <Route path="/renter/dashboard" element={<RenterDashboard />} />
            <Route path="/renter/bookings" element={<MyBookings />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/search" element={<VehicleSearch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
