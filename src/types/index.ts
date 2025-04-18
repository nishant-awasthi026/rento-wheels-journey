
// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "renter";
  profileImage?: string;
  phone?: string;
  address?: string;
  documentsVerified?: boolean;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  location: string;
  image: string;
  images?: string[];
  rating: number;
  features?: string[];
  specifications?: Record<string, string>;
  availability?: boolean;
  availableDates?: DateRange[];
  createdAt?: string;
}

// Booking Types
export interface Booking {
  id: string;
  vehicleId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt?: string;
  vehicle?: {
    name: string;
    brand: string;
    model: string;
    category?: string;
    location?: string;
    image?: string;
  };
  renter?: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Date Range Type
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Review Type
export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
