import { Box, Button, Flex, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";

function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page refresh
    // Do nothing on submit
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="lg"
        shadow="md"
        width="100%"
        maxW="md"
      >
        <Heading mb={6} textAlign="center" size="lg">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="name" mb={4}>
            <FormLabel>Name</FormLabel>
            <Input type="text" placeholder="Enter your name" />
          </FormControl>

          <FormControl id="phone" mb={6}>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" placeholder="Enter your phone number" />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="100%"
          >
            Continue
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Login;
