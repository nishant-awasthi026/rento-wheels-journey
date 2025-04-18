
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, CreditCard, Wallet, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bookingAPI, paymentAPI } from "@/utils/api";
import { Vehicle } from "@/types";

interface BookingFormProps {
  vehicle: Vehicle;
  onBookingComplete?: () => void;
}

const BookingForm = ({ vehicle, onBookingComplete }: BookingFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate total days and price
  const calculateTotalDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1; // Minimum 1 day
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    if (days >= 30 && vehicle.pricePerMonth) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return (months * vehicle.pricePerMonth) + (remainingDays * vehicle.pricePerDay);
    } else if (days >= 7 && vehicle.pricePerWeek) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * vehicle.pricePerWeek) + (remainingDays * vehicle.pricePerDay);
    }
    return days * vehicle.pricePerDay;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format dates for API
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      
      const response = await bookingAPI.createBooking({
        vehicleId: vehicle.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      
      toast({
        title: "Booking Created",
        description: "Please proceed with payment to confirm your booking.",
      });
      
      // Set booking ID for payment processing
      setBookingId(response.booking.id);
      
      // Show payment options
      setShowPayment(true);
      
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;
    
    try {
      setIsSubmitting(true);
      
      if (paymentMethod === "upi") {
        // Process UPI payment
        const response = await paymentAPI.generateUpiLink({
          bookingId,
          amount: calculateTotalPrice(),
          description: `Booking for ${vehicle.name}`
        });
        
        // Open UPI payment link
        window.open(response.paymentLink, "_blank");
        
        toast({
          title: "Payment Initiated",
          description: "Please complete the payment in the UPI app. Your booking will be confirmed afterward.",
        });
      } else {
        // Process cash payment
        await paymentAPI.processPayment({
          bookingId,
          method: "cash",
          amount: calculateTotalPrice()
        });
        
        toast({
          title: "Cash Payment Selected",
          description: "Your booking is confirmed. Please pay at the time of vehicle pickup.",
        });
      }
      
      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setShowPayment(false);
      setBookingId(null);
      
      // Call the callback if provided
      if (onBookingComplete) {
        onBookingComplete();
      }
      
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDays = calculateTotalDays();
  const totalPrice = calculateTotalPrice();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{showPayment ? "Complete Payment" : "Book this Vehicle"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPayment ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date() || (startDate ? date < startDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {totalDays > 0 && (
              <div className="rounded-md bg-gray-50 p-4">
                <div className="font-medium">Booking Summary</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>₹{vehicle.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                  {vehicle.pricePerWeek && totalDays >= 7 && (
                    <div className="flex justify-between text-green-600">
                      <span>Weekly Discount Applied</span>
                      <span>-₹{(totalDays * vehicle.pricePerDay) - calculateTotalPrice()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="rounded-md bg-gray-50 p-4 mb-4">
              <div className="font-medium">Booking Summary</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span>{vehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span>₹{vehicle.pricePerDay}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Select Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as "upi" | "cash")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    UPI Payment (Instant Confirmation)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" />
                    Cash on Delivery (Pay at Pickup)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!showPayment ? (
          <Button 
            onClick={handleSubmit}
            disabled={!startDate || !endDate || isSubmitting}
            className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Continue to Payment</>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handlePayment}
            disabled={isSubmitting}
            className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Complete {paymentMethod.toUpperCase()} Payment</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
