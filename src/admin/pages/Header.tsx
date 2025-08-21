import { Flex, Button, Text } from "@chakra-ui/react";

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      bg="teal.500"
      color="white"
      p={4}
    >
      <Text fontWeight="bold" fontSize="xl">
        Admin Dashboard
      </Text>
      <Button colorScheme="teal" variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </Flex>
  );
}

export default Header;