
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "renter";
  profileImage?: string;
}

// Define the context types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, role: "owner" | "renter") => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in on initial render
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem("rentoUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // This is a mock implementation for demo purposes
      const mockUser = {
        id: "user123",
        name: email.split('@')[0],
        email,
        role: email.includes("owner") ? "owner" : "renter",
      } as User;
      
      // Store user in localStorage
      localStorage.setItem("rentoUser", JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: "Welcome back to RENTO!",
      });
      
      // Redirect based on user role
      if (mockUser.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/renter/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: any, role: "owner" | "renter") => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // This is a mock implementation for demo purposes
      const mockUser = {
        id: "user" + Math.random().toString(36).substr(2, 9),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        role,
      } as User;
      
      // Store user in localStorage
      localStorage.setItem("rentoUser", JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: "Welcome to RENTO!",
      });
      
      // Redirect based on user role
      if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/renter/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was a problem with your registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("rentoUser");
    setUser(null);
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
