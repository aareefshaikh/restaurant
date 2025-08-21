import { Box, Button, Input, VStack, Text, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { supabase } from "../../supabase";

type FormData = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    const { error, data: { session} } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else if (session) {
      localStorage.setItem("admin", JSON.stringify({ email }));
      navigate("/admin/dashboard");
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack spacing={4} p={8} borderWidth={1} borderRadius="md">
        <Text fontSize="2xl">Admin Login</Text>

        <FormControl isInvalid={!!errors.email}>
          <Input
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit(onSubmit)}>
          Login
        </Button>
      </VStack>
    </Box>
  );
}
