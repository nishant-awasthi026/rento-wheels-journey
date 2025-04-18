
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VehicleSearch from "./pages/VehicleSearch";
import VehicleDetails from "./pages/VehicleDetails";
import NotFound from "./pages/NotFound";

// Renter Pages
import RenterDashboard from "./pages/renter/Dashboard";
import MyBookings from "./pages/renter/MyBookings";

// Owner Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerVehicles from "./pages/owner/Vehicles";
import AddVehicle from "./pages/owner/AddVehicle";
import ManageBookings from "./pages/owner/ManageBookings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<VehicleSearch />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          
          {/* Renter Routes */}
          <Route path="/renter/dashboard" element={<RenterDashboard />} />
          <Route path="/renter/bookings" element={<MyBookings />} />
          
          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/vehicles" element={<OwnerVehicles />} />
          <Route path="/owner/vehicles/new" element={<AddVehicle />} />
          <Route path="/owner/bookings" element={<ManageBookings />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
