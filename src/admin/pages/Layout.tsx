import { Box, Flex, VStack, Button, Text } from "@chakra-ui/react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const isAdminLoggedIn = !!localStorage.getItem("admin");

  return isAdminLoggedIn ? (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box w="220px" bg="gray.100" p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={6}>
          Admin Panel
        </Text>
        <VStack align="stretch" spacing={3}>
            <NavLink
                to="/admin/orders"
                style={({ isActive }) => ({
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: isActive ? "#319795" : "transparent",
                    color: isActive ? "white" : "black",
                    textDecoration: "none",
                })}
                >
                Orders
            </NavLink>

            <NavLink
                to="/admin/menu"
                style={({ isActive }) => ({
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: isActive ? "#319795" : "transparent",
                    color: isActive ? "white" : "black",
                    textDecoration: "none",
                })}
            >
                Menu Management
            </NavLink>

        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={6}>
        <Flex justify="flex-end" mb={4}>
          <Button size="sm" colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>

        {/* Nested routes will render here */}
        <Outlet />
      </Box>
    </Flex>
  ) : <Navigate to="/admin/login" replace />;
}
