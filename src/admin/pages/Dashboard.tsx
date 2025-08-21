import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideNavigation";

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState("orders");
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      const parsed = JSON.parse(admin);
      setAdminEmail(parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <Box>
      <Header onLogout={handleLogout} />
      <Flex>
        <Sidebar selected={selectedSection} onSelect={setSelectedSection} />
        <Box p={8} flex="1">
          <Text fontSize="2xl" mb={4}>
            Welcome, {adminEmail}
          </Text>
          <Text>Selected section: {selectedSection}</Text>
        </Box>
      </Flex>
    </Box>
  );
}
