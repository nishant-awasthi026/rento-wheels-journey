
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import VehicleGrid from "../vehicle/VehicleGrid";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles?limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast({
          title: "Error",
          description: "Failed to load vehicles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [toast]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
            <p className="mt-2 text-gray-600">Explore our most popular rental options</p>
          </div>
          <Link to="/search">
            <Button variant="ghost" className="text-rento-dark hover:text-rento-yellow">
              View All <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <VehicleGrid vehicles={vehicles} loading={loading} />
      </div>
    </section>
  );
};

export default FeaturedVehicles;
