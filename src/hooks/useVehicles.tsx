
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "@/types";
import { vehicleAPI } from "@/utils/api";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const ownerVehicles = await vehicleAPI.getOwnerVehicles();
      setVehicles(ownerVehicles);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Success",
        description: "Vehicle successfully deleted",
      });
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;

      const newAvailability = !vehicle.availability;
      await vehicleAPI.toggleAvailability(id, newAvailability);

      setVehicles(
        vehicles.map((v) =>
          v.id === id ? { ...v, availability: newAvailability } : v
        )
      );

      toast({
        title: "Success",
        description: `Vehicle is now ${newAvailability ? "available" : "unavailable"}`,
      });
    } catch (error) {
      console.error("Failed to update vehicle availability:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchTerms = searchQuery.toLowerCase().trim().split(" ");
    const vehicleText = `${vehicle.name} ${vehicle.brand} ${vehicle.model} ${vehicle.location}`.toLowerCase();
    
    return searchTerms.every(term => vehicleText.includes(term));
  });

  return {
    vehicles: filteredVehicles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeleteVehicle,
    handleToggleAvailability,
    refreshVehicles: fetchVehicles
  };
};
