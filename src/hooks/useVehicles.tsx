
import { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/utils/api";

export const useVehicles = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const fetchVehicles = async () => {
    if (!user || !token) return;
    
    try {
      const data = await fetchWithAuth('/vehicles/owner');
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load your vehicles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vehicles.filter(vehicle => 
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query) ||
        vehicle.location.toLowerCase().includes(query)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const handleDeleteVehicle = async (id: string) => {
    if (!token) return;
    
    try {
      await fetchWithAuth(`/vehicles/${id}`, {
        method: 'DELETE'
      });
      
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
      setVehicles(updatedVehicles);
      setFilteredVehicles(updatedVehicles);
      
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been successfully removed from your listings",
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (id: string) => {
    if (!token) return;
    
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    try {
      await fetchWithAuth(`/vehicles/${id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ availability: !vehicle.availability })
      });
      
      const updatedVehicles = vehicles.map(v => {
        if (v.id === id) {
          return {
            ...v,
            availability: !v.availability,
          };
        }
        return v;
      });
      
      setVehicles(updatedVehicles);
      setFilteredVehicles(updatedVehicles.filter(v => {
        if (searchQuery.trim() === "") return true;
        
        const query = searchQuery.toLowerCase();
        return v.name.toLowerCase().includes(query) ||
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.category.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query);
      }));
      
      toast({
        title: vehicle.availability ? "Vehicle Unavailable" : "Vehicle Available",
        description: vehicle.availability 
          ? "Your vehicle is now marked as unavailable for rent" 
          : "Your vehicle is now available for rent",
      });
    } catch (error) {
      console.error('Error updating vehicle availability:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle availability. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    vehicles: filteredVehicles,
    loading,
    searchQuery,
    setSearchQuery,
    handleDeleteVehicle,
    handleToggleAvailability
  };
};
