
import { Vehicle, Booking, Review } from "@/types";

// Mock Vehicles Data
export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    ownerId: "o1",
    name: "Honda Activa 6G",
    description: "A reliable, fuel-efficient scooter perfect for city commuting. Easy to ride and maneuver through traffic.",
    category: "2-wheeler",
    brand: "Honda",
    model: "Activa 6G",
    year: 2021,
    pricePerDay: 300,
    pricePerWeek: 1800,
    pricePerMonth: 7000,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1597586124394-fbd6ef244026?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    features: ["Fuel efficient", "Easy to handle", "CBS braking system", "Digital-analog meter"],
    specifications: {
      "Engine": "110cc",
      "Mileage": "60 kmpl",
      "Top Speed": "85 km/h",
      "Fuel Capacity": "5.3 liters"
    },
    availability: true,
  },
  {
    id: "v2",
    ownerId: "o2",
    name: "Maruti Suzuki Swift",
    description: "Compact hatchback with excellent fuel efficiency and comfortable interior. Perfect for city driving and short trips.",
    category: "4-wheeler",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2022,
    pricePerDay: 1200,
    pricePerWeek: 7200,
    pricePerMonth: 28000,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    features: ["AC", "Power Steering", "Power Windows", "Central Locking", "Music System"],
    specifications: {
      "Engine": "1.2L Petrol",
      "Mileage": "22 kmpl",
      "Seating Capacity": "5",
      "Transmission": "Manual"
    },
    availability: true,
  },
  {
    id: "v3",
    ownerId: "o1",
    name: "Mahindra Thar",
    description: "Off-road SUV with 4x4 capability. Perfect for adventure trips and challenging terrains.",
    category: "4-wheeler",
    brand: "Mahindra",
    model: "Thar",
    year: 2021,
    pricePerDay: 2500,
    pricePerWeek: 15000,
    pricePerMonth: 60000,
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1601676386608-5838e8d8e0a3?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    features: ["4x4 Drive", "AC", "Power Steering", "Touchscreen Infotainment", "Roll Cage"],
    specifications: {
      "Engine": "2.0L Turbo Petrol",
      "Mileage": "15 kmpl",
      "Seating Capacity": "4",
      "Transmission": "Manual"
    },
    availability: true,
  },
  {
    id: "v4",
    ownerId: "o3",
    name: "Royal Enfield Classic 350",
    description: "Iconic motorcycle with a vintage look and powerful engine. Ideal for long road trips and cruising.",
    category: "2-wheeler",
    brand: "Royal Enfield",
    model: "Classic 350",
    year: 2020,
    pricePerDay: 800,
    pricePerWeek: 4800,
    pricePerMonth: 19000,
    location: "Pune",
    image: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    features: ["Dual-channel ABS", "Electric Start", "Fuel Gauge", "USB Charging"],
    specifications: {
      "Engine": "349cc",
      "Mileage": "35 kmpl",
      "Top Speed": "120 km/h",
      "Fuel Capacity": "13 liters"
    },
    availability: true,
  },
  {
    id: "v5",
    ownerId: "o2",
    name: "Tata Ace",
    description: "Small commercial truck perfect for transporting goods in urban areas. Easy to drive with good loading capacity.",
    category: "6-wheeler",
    brand: "Tata",
    model: "Ace",
    year: 2019,
    pricePerDay: 1500,
    pricePerWeek: 9000,
    pricePerMonth: 35000,
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1578785344575-7a3e7721178f?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    features: ["Power Steering", "AC", "Loading Capacity 1 ton"],
    specifications: {
      "Engine": "800cc Diesel",
      "Mileage": "18 kmpl",
      "Loading Capacity": "1 ton",
      "Transmission": "Manual"
    },
    availability: true,
  },
  {
    id: "v6",
    ownerId: "o3",
    name: "BharatBenz 1617R",
    description: "Medium-duty truck with excellent fuel efficiency and loading capacity. Ideal for intercity goods transport.",
    category: "10-wheeler",
    brand: "BharatBenz",
    model: "1617R",
    year: 2020,
    pricePerDay: 5000,
    pricePerWeek: 30000,
    pricePerMonth: 120000,
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1573497271640-193ff3281963?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    features: ["AC Cabin", "Sleeper Berth", "GPS Tracking", "High Loading Capacity"],
    specifications: {
      "Engine": "5.9L Diesel",
      "Mileage": "8 kmpl",
      "Loading Capacity": "10 ton",
      "Transmission": "6-Speed Manual"
    },
    availability: true,
  },
  {
    id: "v7",
    ownerId: "o1",
    name: "Volvo FH16",
    description: "Heavy-duty truck with maximum power and loading capacity. Best for long-distance heavy cargo transport.",
    category: "20-wheeler",
    brand: "Volvo",
    model: "FH16",
    year: 2021,
    pricePerDay: 8000,
    pricePerWeek: 48000,
    pricePerMonth: 190000,
    location: "Kolkata",
    image: "https://images.unsplash.com/photo-1616094172853-0222bfe4e2f0?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    features: ["Luxury Cabin", "Advanced Safety Features", "Telematics", "Fuel Efficiency Technology"],
    specifications: {
      "Engine": "16.1L Diesel",
      "Mileage": "5 kmpl",
      "Loading Capacity": "25 ton",
      "Transmission": "12-Speed Automated"
    },
    availability: true,
  },
  {
    id: "v8",
    ownerId: "o2",
    name: "Yamaha YZF R15",
    description: "Sports bike with excellent performance and handling. Perfect for thrill-seekers and racing enthusiasts.",
    category: "2-wheeler",
    brand: "Yamaha",
    model: "YZF R15",
    year: 2022,
    pricePerDay: 1000,
    pricePerWeek: 6000,
    pricePerMonth: 24000,
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    features: ["Dual Channel ABS", "Quick Shifter", "Assist & Slipper Clutch", "Delta Box Frame"],
    specifications: {
      "Engine": "155cc",
      "Mileage": "40 kmpl",
      "Top Speed": "150 km/h",
      "Fuel Capacity": "11 liters"
    },
    availability: true,
  },
  {
    id: "v9",
    ownerId: "o3",
    name: "Toyota Innova Crysta",
    description: "Comfortable and spacious MPV perfect for family trips and group travel. Reliable and fuel-efficient.",
    category: "4-wheeler",
    brand: "Toyota",
    model: "Innova Crysta",
    year: 2021,
    pricePerDay: 3000,
    pricePerWeek: 18000,
    pricePerMonth: 72000,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1623006772851-a8f8732d626a?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    features: ["AC", "Power Steering", "Power Windows", "Touchscreen Infotainment", "Rear Camera"],
    specifications: {
      "Engine": "2.4L Diesel",
      "Mileage": "14 kmpl",
      "Seating Capacity": "7",
      "Transmission": "Automatic"
    },
    availability: true,
  },
  {
    id: "v10",
    ownerId: "o1",
    name: "Honda City",
    description: "Elegant sedan with premium features and comfortable ride. Ideal for business travel and family use.",
    category: "4-wheeler",
    brand: "Honda",
    model: "City",
    year: 2022,
    pricePerDay: 1800,
    pricePerWeek: 10800,
    pricePerMonth: 43000,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    features: ["Sunroof", "Cruise Control", "Leather Seats", "Android Auto & Apple CarPlay"],
    specifications: {
      "Engine": "1.5L Petrol",
      "Mileage": "18 kmpl",
      "Seating Capacity": "5",
      "Transmission": "CVT"
    },
    availability: true,
  },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: "b1",
    vehicleId: "v1",
    renterId: "r1",
    ownerId: "o1",
    startDate: "2023-06-10",
    endDate: "2023-06-15",
    totalAmount: 1500,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2023-06-01",
  },
  {
    id: "b2",
    vehicleId: "v2",
    renterId: "r2",
    ownerId: "o2",
    startDate: "2023-06-20",
    endDate: "2023-06-25",
    totalAmount: 6000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-05",
  },
  {
    id: "b3",
    vehicleId: "v3",
    renterId: "r1",
    ownerId: "o1",
    startDate: "2023-07-05",
    endDate: "2023-07-10",
    totalAmount: 12500,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2023-06-20",
  },
  {
    id: "b4",
    vehicleId: "v4",
    renterId: "r3",
    ownerId: "o3",
    startDate: "2023-06-15",
    endDate: "2023-06-18",
    totalAmount: 2400,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2023-06-02",
  },
  {
    id: "b5",
    vehicleId: "v5",
    renterId: "r2",
    ownerId: "o2",
    startDate: "2023-07-10",
    endDate: "2023-07-20",
    totalAmount: 15000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-25",
  },
];

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    id: "r1",
    vehicleId: "v1",
    userId: "r1",
    userName: "Rahul Sharma",
    rating: 5,
    comment: "Great scooter! Very smooth to ride and excellent fuel efficiency.",
    date: "2023-06-16",
  },
  {
    id: "r2",
    vehicleId: "v2",
    userId: "r2",
    userName: "Priya Patel",
    rating: 4,
    comment: "The car was clean and well-maintained. Good for city driving.",
    date: "2023-06-26",
  },
  {
    id: "r3",
    vehicleId: "v3",
    userId: "r1",
    userName: "Rahul Sharma",
    rating: 5,
    comment: "Amazing off-road experience! The Thar handled all terrains perfectly.",
    date: "2023-05-15",
  },
  {
    id: "r4",
    vehicleId: "v4",
    userId: "r3",
    userName: "Ankit Gupta",
    rating: 4,
    comment: "Classic Royal Enfield experience. Great for long rides.",
    date: "2023-06-19",
  },
  {
    id: "r5",
    vehicleId: "v1",
    userId: "r2",
    userName: "Priya Patel",
    rating: 4,
    comment: "Comfortable scooter, easy to handle in traffic.",
    date: "2023-05-20",
  },
];
