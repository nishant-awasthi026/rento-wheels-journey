import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  Star,
  PenLine,
  Trash2,
  X,
  Check,
  Upload,
  Calendar,
  DollarSign,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";

const OwnerVehicles = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  
  const fetchVehicles = async () => {
    if (!user || !token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/owner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const data = await response.json();
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
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      
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
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ availability: !vehicle.availability })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vehicle availability');
      }
      
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
              <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
            </div>
            <Link to="/owner/vehicles/new">
              <Button className="bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                <Plus size={16} className="mr-2" />
                Add New Vehicle
              </Button>
            </Link>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by name, brand, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Vehicles</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderVehicleList(filteredVehicles)}
              </TabsContent>
              
              <TabsContent value="available">
                {renderVehicleList(filteredVehicles.filter(v => v.availability))}
              </TabsContent>
              
              <TabsContent value="unavailable">
                {renderVehicleList(filteredVehicles.filter(v => !v.availability))}
              </TabsContent>
            </Tabs>
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "You haven't listed any vehicles yet"}
              </p>
              {!searchQuery && (
                <Link to="/owner/vehicles/new">
                  <Button className="mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                    Add Your First Vehicle
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );

  function renderVehicleList(vehicleList: Vehicle[]) {
    if (vehicleList.length === 0) {
      return (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No vehicles found</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {vehicleList.map(vehicle => (
          <div 
            key={vehicle.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={vehicle.image || "/placeholder.svg"} 
                alt={vehicle.name} 
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="outline" 
                  className={vehicle.availability 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {vehicle.availability ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg text-gray-900">{vehicle.name}</h3>
                  <p className="text-sm text-gray-500">
                    {vehicle.brand} {vehicle.model} • {vehicle.year} • {vehicle.category}
                  </p>
                </div>
                <div className="flex items-center text-rento-yellow">
                  <Star size={16} className="fill-current" />
                  <span className="ml-1 text-sm font-medium">{vehicle.rating || 0}</span>
                </div>
              </div>
              
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1 text-gray-400" />
                  {vehicle.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign size={16} className="mr-1 text-gray-400" />
                  ₹{vehicle.pricePerDay}/day
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-1 text-gray-400" />
                  {new Date(vehicle.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleAvailability(vehicle.id)}
                  className={vehicle.availability ? "border-red-500 text-red-600" : "border-green-500 text-green-600"}
                >
                  {vehicle.availability ? (
                    <>
                      <X size={14} className="mr-1" />
                      Mark Unavailable
                    </>
                  ) : (
                    <>
                      <Check size={14} className="mr-1" />
                      Mark Available
                    </>
                  )}
                </Button>
                <Link to={`/owner/vehicles/${vehicle.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <PenLine size={14} className="mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="border-red-500 text-red-600"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
                <Button variant="outline" size="sm">
                  <Upload size={14} className="mr-1" />
                  Update Photos
                </Button>
                <Link to={`/owner/vehicles/${vehicle.id}/calendar`}>
                  <Button variant="outline" size="sm">
                    <Calendar size={14} className="mr-1" />
                    Manage Availability
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default OwnerVehicles;
