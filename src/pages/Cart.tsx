import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Divider,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useCart } from "../context/CartContext";
import Header from "./Header";
import { supabase } from "../supabase";

const GST_PERCENTAGE = 0.18; // 18% GST

const CartPage: React.FC = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Calculate subtotal
  const subtotal = Object.values(cart).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const gst = subtotal * GST_PERCENTAGE;
  const total = subtotal + gst;

  // Handle proceed to checkout
  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      toast({ title: "Cart is empty", status: "warning" });
      return;
    }

    setLoading(true);

    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("order")
        .insert([
          {
            customer_name: user.name || "Guest",
            customer_mobile: user.phone || "N/A",
            total_amount: total,
            status: "PAYMENT_PENDING",
          },
        ])
        .select()
        .single();

      if (orderError || !orderData) throw orderError;

      const orderId = orderData.id;

      // 2. Insert order items
      const itemsToInsert = Object.values(cart).map((item) => ({
        order_id: orderId,
        item_name: item.name,
        quantity: item.quantity,
        price_per_item: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_item")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({ title: "Order created", status: "success" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create order", status: "error" });
    } finally {
      setLoading(false);
    }
  };

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
            <Button
              colorScheme="blue"
              size="lg"
              mt={4}
              isLoading={loading}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export default CartPage;
