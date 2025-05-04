
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import HowItWorks from "./pages/HowItWorks";
import AdminDashboard from "./pages/AdminDashboard";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import CreateShop from "./pages/CreateShop";
import CreateProduct from "./pages/CreateProduct";
import About from "./pages/About";
import Cart from "./pages/Cart";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/products" element={<Products />} />
              <Route path="/shop/:id" element={<Shop />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes for all authenticated users */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Shopkeeper routes */}
              <Route path="/shopkeeper/dashboard" element={
                <ProtectedRoute allowedRoles={['shopkeeper']}>
                  <ShopkeeperDashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-shop" element={
                <ProtectedRoute>
                  <CreateShop />
                </ProtectedRoute>
              } />
              <Route path="/shopkeeper/create-product" element={
                <ProtectedRoute allowedRoles={['shopkeeper']}>
                  <CreateProduct />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
