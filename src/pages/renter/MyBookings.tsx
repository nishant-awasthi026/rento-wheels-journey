
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  Map, 
  ChevronDown,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/types";
import { useBookings } from "@/hooks/useBookings";

const MyBookings = () => {
  const { user } = useAuth();
  const { allBookings: bookings, loading } = useBookings();
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Apply filters whenever dependencies change
    applyFilters();
  }, [searchQuery, filter, bookings]);

  const applyFilters = () => {
    let filtered = [...bookings];
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => {
        const vehicle = booking.vehicle;
        return (
          (vehicle?.name?.toLowerCase().includes(query) || false) ||
          (vehicle?.brand?.toLowerCase().includes(query) || false) ||
          (vehicle?.model?.toLowerCase().includes(query) || false) ||
          (vehicle?.location?.toLowerCase().includes(query) || false) ||
          booking.id.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(booking => booking.status === filter);
    }
    
    setFilteredBookings(filtered);
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage all your vehicle bookings</p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by vehicle or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderBookingsList(filteredBookings)}
            </TabsContent>
            
            <TabsContent value="upcoming">
              {renderBookingsList(filteredBookings.filter(b => b.status === "pending" || b.status === "confirmed"))}
            </TabsContent>
            
            <TabsContent value="past">
              {renderBookingsList(filteredBookings.filter(b => b.status === "completed" || b.status === "cancelled"))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );

  function renderBookingsList(bookings: Booking[]) {
    if (bookings.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || filter !== "all" 
              ? "Try adjusting your search or filter" 
              : "You haven't made any bookings yet"}
          </p>
          {!searchQuery && filter === "all" && (
            <Link to="/search">
              <Button className="mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                Find Vehicles to Rent
              </Button>
            </Link>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {bookings.map(booking => {
          const vehicle = booking.vehicle;
          return (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={vehicle?.image || "/placeholder.svg"} 
                  alt={vehicle?.name || "Vehicle"} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{vehicle?.name || "Vehicle"}</h3>
                    <p className="text-sm text-gray-500">
                      {vehicle?.brand || ""} {vehicle?.model || ""} • {vehicle?.category || ""}
                    </p>
                  </div>
                  {getBookingStatusBadge(booking.status)}
                </div>
                
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    <span>
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Map size={16} className="mr-1 text-gray-400" />
                    {vehicle?.location || "Location not available"}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="font-medium">Total: ₹{booking.totalAmount}</div>
                  <div className="flex space-x-2">
                    {booking.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <Star size={16} className="mr-1" />
                        Leave Review
                      </Button>
                    )}
                    <Link to={`/vehicle/${booking.vehicleId}`}>
                      <Button variant="outline" size="sm">
                        View Vehicle
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      className="bg-rento-yellow hover:bg-rento-gold text-rento-dark"
                    >
                      Booking Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default MyBookings;
