// src/pages/CartPage.tsx
import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useCart } from "../context/CartContext";
import Header from "./Header";

const GST_PERCENTAGE = 0.18; // 18% GST

const CartPage: React.FC = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();

  // Calculate subtotal
  const subtotal = Object.values(cart).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const gst = subtotal * GST_PERCENTAGE;
  const total = subtotal + gst;

  return (
    <>
      <Header />
      <Flex
        maxW="1200px"
        mx="auto"
        mt={8}
        px={4}
        direction={{ base: "column", md: "row" }}
        gap={8}
      >
        {/* Left: Cart Items */}
        <Box flex={2} bg="white" p={4} borderRadius="md" shadow="md">
          <Heading size="md" mb={4}>
            Your Cart
          </Heading>
          {Object.keys(cart).length === 0 ? (
            <Text>Your cart is empty.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {Object.values(cart).map((item) => (
                <Flex
                  key={item.id}
                  justify="space-between"
                  align="center"
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>₹{item.price.toFixed(2)}</Text>
                  </Box>
                  <HStack>
                    <Button
                      size="sm"
                      onClick={() => removeItem(item)}
                      colorScheme="red"
                    >
                      -
                    </Button>
                    <Text>{item.quantity}</Text>
                    <Button
                      size="sm"
                      onClick={() => addItem(item)}
                      colorScheme="green"
                    >
                      +
                    </Button>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          )}
          {Object.keys(cart).length > 0 && (
            <Button
              mt={4}
              colorScheme="red"
              variant="outline"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          )}
        </Box>

        {/* Right: Order Summary */}
        <Box flex={1} bg="white" p={4} borderRadius="md" shadow="md">
          <Heading size="md" mb={4}>
            Order Summary
          </Heading>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text>Subtotal</Text>
              <Text>₹{subtotal.toFixed(2)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>GST (18%)</Text>
              <Text>₹{gst.toFixed(2)}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" fontWeight="bold">
              <Text>Total</Text>
              <Text>₹{total.toFixed(2)}</Text>
            </Flex>
            <Button colorScheme="blue" size="lg" mt={4}>
              Proceed to Checkout
            </Button>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export default CartPage;
