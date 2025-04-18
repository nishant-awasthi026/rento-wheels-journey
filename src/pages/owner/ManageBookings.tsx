
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Calendar, CheckCheck, Clock, X } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import BookingRequestCard from "@/components/owner/BookingRequestCard";
import { Booking } from "@/types";

const ManageBookings = () => {
  const { 
    allBookings, 
    loading, 
    updateBookingStatus,
    refreshBookings 
  } = useBookings({ isOwner: true });
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const pendingBookings = allBookings.filter(booking => booking.status === "pending");
  const confirmedBookings = allBookings.filter(booking => booking.status === "confirmed");
  const completedBookings = allBookings.filter(booking => booking.status === "completed");
  const cancelledBookings = allBookings.filter(booking => booking.status === "cancelled");
  
  const filteredBookings = (bookings: Booking[]) => {
    if (!searchQuery.trim()) return bookings;
    
    const query = searchQuery.toLowerCase();
    return bookings.filter(booking => {
      return (
        booking.vehicle?.name?.toLowerCase().includes(query) ||
        booking.vehicle?.brand?.toLowerCase().includes(query) ||
        booking.vehicle?.model?.toLowerCase().includes(query) ||
        booking.vehicle?.location?.toLowerCase().includes(query) ||
        booking.renter?.name?.toLowerCase().includes(query) ||
        booking.renter?.email?.toLowerCase().includes(query)
      );
    });
  };
  
  const handleAccept = async (id: string) => {
    const success = await updateBookingStatus(id, "confirmed");
    if (success) {
      refreshBookings();
    }
    return success;
  };
  
  const handleReject = async (id: string) => {
    const success = await updateBookingStatus(id, "cancelled");
    if (success) {
      refreshBookings();
    }
    return success;
  };
  
  const handleComplete = async (id: string) => {
    const success = await updateBookingStatus(id, "completed");
    if (success) {
      refreshBookings();
    }
    return success;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage all your vehicle booking requests</p>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search bookings by vehicle or renter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Pending
                {pendingBookings.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {pendingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex items-center">
                <CheckCheck className="mr-2 h-4 w-4" />
                Confirmed
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                Cancelled
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-40 rounded-t-lg"></div>
                      <div className="bg-white p-4 rounded-b-lg">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredBookings(pendingBookings).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No pending bookings</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery ? "No bookings match your search" : "You don't have any pending booking requests"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings(pendingBookings).map(booking => (
                    <BookingRequestCard 
                      key={booking.id} 
                      booking={booking} 
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="confirmed">
              {/* Confirmed bookings content */}
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : filteredBookings(confirmedBookings).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <CheckCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No confirmed bookings</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery ? "No bookings match your search" : "You don't have any confirmed bookings yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings(confirmedBookings).map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={booking.vehicle?.image || "/placeholder.svg"} 
                          alt={booking.vehicle?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg text-gray-900">{booking.vehicle?.name}</h3>
                            <p className="text-sm text-gray-500">
                              {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                          </div>
                          <div className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 text-xs rounded-md">
                            Confirmed
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="font-medium mt-1">Renter: {booking.renter?.name}</div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="font-medium">₹{booking.totalAmount}</div>
                          <button 
                            onClick={() => handleComplete(booking.id)}
                            className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-sm rounded-md hover:bg-blue-100 transition-colors"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {/* Completed bookings content - similar structure */}
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : filteredBookings(completedBookings).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No completed bookings</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery ? "No bookings match your search" : "You don't have any completed bookings yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings(completedBookings).map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={booking.vehicle?.image || "/placeholder.svg"} 
                          alt={booking.vehicle?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg text-gray-900">{booking.vehicle?.name}</h3>
                            <p className="text-sm text-gray-500">
                              {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                          </div>
                          <div className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs rounded-md">
                            Completed
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="font-medium mt-1">Renter: {booking.renter?.name}</div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="font-medium">₹{booking.totalAmount}</div>
                          <div className="text-sm text-gray-500">Completed on {new Date(booking.updatedAt || booking.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {/* Cancelled bookings content - similar structure */}
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : filteredBookings(cancelledBookings).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No cancelled bookings</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery ? "No bookings match your search" : "You don't have any cancelled bookings"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings(cancelledBookings).map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={booking.vehicle?.image || "/placeholder.svg"} 
                          alt={booking.vehicle?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg text-gray-900">{booking.vehicle?.name}</h3>
                            <p className="text-sm text-gray-500">
                              {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                          </div>
                          <div className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 text-xs rounded-md">
                            Cancelled
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="font-medium mt-1">Renter: {booking.renter?.name}</div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="font-medium">₹{booking.totalAmount}</div>
                          <div className="text-sm text-gray-500">Cancelled on {new Date(booking.updatedAt || new Date()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageBookings;
