
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/utils/api";
import { Booking } from "@/types";

interface PaymentProcessorProps {
  booking: Booking;
  onPaymentComplete: () => void;
}

const PaymentProcessor = ({ booking, onPaymentComplete }: PaymentProcessorProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      if (paymentMethod === "upi") {
        // Generate UPI payment link
        const response = await paymentAPI.generateUpiLink({
          bookingId: booking.id,
          amount: booking.totalAmount,
          description: `Payment for booking #${booking.id}`
        });
        
        // Redirect to UPI payment page or open in new tab
        window.open(response.paymentLink, "_blank");
        
        toast({
          title: "UPI Payment Initiated",
          description: "Please complete the payment in the opened window. Your booking will be confirmed after payment verification."
        });
      } else {
        // Process cash payment
        await paymentAPI.processPayment({
          bookingId: booking.id,
          method: "cash",
          amount: booking.totalAmount
        });
        
        toast({
          title: "Cash Payment Selected",
          description: "Your booking is confirmed. Please pay at the time of vehicle pickup."
        });
      }
      
      // Call the completion callback
      onPaymentComplete();
      
    } catch (error) {
      console.error("Payment processing failed:", error);
      toast({
        title: "Payment Failed",
        description: "We couldn't process your payment. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-gray-50 p-4 mb-4">
          <h3 className="font-medium">Booking Summary</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span>#{booking.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vehicle:</span>
              <span>{booking.vehicle?.name || "Vehicle"}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>₹{booking.totalAmount}</span>
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Proceed with {paymentMethod.toUpperCase()} Payment</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentProcessor;
