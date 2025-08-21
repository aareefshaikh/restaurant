import { Box, Heading, Text } from "@chakra-ui/react";
import { useUser } from "../context/UserContext";

function Menu() {
  const { user } = useUser();

  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>
        Welcome {user?.name || "Guest"} 👋
      </Heading>
      <Text fontSize="md" color="gray.600">
        Browse our delicious menu and add items to your cart!
      </Text>
    </Box>
  );
}

export default Menu;
