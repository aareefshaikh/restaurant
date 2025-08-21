import {
  Box, Button, Flex, FormControl, FormLabel, Input,
  Heading, FormErrorMessage
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

interface LoginForm {
  name: string;
  phone: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setUser, user } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/menu", { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    setUser({ name: data.name, phone: data.phone });
    navigate("/menu");
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box bg="white" p={8} rounded="lg" shadow="md" width="100%" maxW="md">
        <Heading mb={6} textAlign="center" size="lg">
          Login
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="name" mb={4} isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: true, minLength: 2 })}
            />
            <FormErrorMessage>
              {errors.name && "Name must be at least 2 characters"}
            </FormErrorMessage>
          </FormControl>

          <FormControl id="phone" mb={6} isInvalid={!!errors.phone}>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone", {
                required: true,
                pattern: /^[6-9]\d{9}$/,
              })}
            />
            <FormErrorMessage>
              {errors.phone && "Enter a valid phone number"}
            </FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="100%">
            Continue
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Login;
