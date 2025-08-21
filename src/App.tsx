import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import { UserProvider, useUser } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import type { ReactNode } from "react";
import AdminLogin from "./admin/pages/Login";
import AdminLayout from "./admin/pages/Layout";
import MenuManagement from "./admin/pages/MenuManagement";
import Orders from "./admin/pages/OrderManagement";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // or a Chakra Spinner
  }

  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="menu" element={<MenuManagement />} />
                <Route path="orders" element={<Orders />} />
                <Route index element={<Navigate to="/admin/orders" replace />} />
              </Route>
              <Route path="/" element={<Login />} />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                }
              />
              {/* placeholder for cart page */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <div>Cart Page (coming soon)</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
