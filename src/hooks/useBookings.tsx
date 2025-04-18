
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types";
import { bookingAPI } from "@/utils/api";

interface UseBookingsProps {
  filter?: string;
  isOwner?: boolean;
}

export const useBookings = ({ filter, isOwner = false }: UseBookingsProps = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredBookings(bookings.filter(booking => booking.status === filter));
    } else {
      setFilteredBookings(bookings);
    }
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userBookings = await bookingAPI.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setError("Failed to load bookings. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await bookingAPI.updateBookingStatus(id, status);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, status, updatedAt: new Date().toISOString() } : booking
        )
      );
      
      // Show success message
      const statusMessages = {
        confirmed: "Booking confirmed successfully",
        cancelled: "Booking cancelled successfully",
        completed: "Booking marked as completed"
      };
      
      toast({
        title: "Success",
        description: statusMessages[status],
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to update booking status:`, error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    bookings: filteredBookings,
    allBookings: bookings,
    loading,
    error,
    refreshBookings: fetchBookings,
    updateBookingStatus
  };
};
