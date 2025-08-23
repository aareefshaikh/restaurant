import { useEffect, useState, useRef } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Divider,
  Icon,
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { supabase } from "../supabase";
import Header from "./Header";
import { useCart } from "../context/CartContext";

interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  price_per_item: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_mobile: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AfterPayment() {
  const [status, setStatus] = useState<"success" | "failure">("success");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { clearCart } = useCart();

  useEffect(() => {
    const url = new URL(window.location.href);
    const s = url.searchParams.get("status");
    if (s === "failure") setStatus("failure");

    // If success, fetch the order from Supabase using orderId param
    if (s === "success") {
      const orderId = url.searchParams.get("orderId");
      if (!orderId) {
        toast({ title: "Order ID not found", status: "error" });
        setLoading(false);
        return;
      }
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const { data: orderData, error: orderError } = await supabase
        .from("order")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !orderData) throw orderError || new Error("Order not found");
      setOrder(orderData);

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_item")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
      clearCart();
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to fetch order", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price_per_item * item.quantity,
    0
  );
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  const handlePrint = () => {
    if (invoiceRef.current) {
      window.print();
    }
  };

  if (loading) return <Spinner size="xl" mt={20} mx="auto" display="block" />;

  return (
    <>
      <Header />
      <VStack spacing={6} mt={10} textAlign="center">
        <Icon
          as={status === "success" ? CheckCircleIcon : WarningIcon}
          boxSize="80px"
          color={status === "success" ? "green.400" : "red.400"}
        />
        <Text fontSize="3xl" fontWeight="bold">
          {status === "success"
            ? "Thank you! Your payment was successful."
            : "Payment Failed. Please try again."}
        </Text>

        {status === "success" && order && (
          <Box
            ref={invoiceRef}
            w="full"
            maxW="600px"
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            shadow="md"
            bg="white"
            className="invoice"
          >
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Isra's Cafe – Invoice
            </Text>
            <Text fontSize="sm" mb={1}>
              Order ID: {order.id}
            </Text>
            <Text fontSize="sm" mb={2}>
              Customer: {order.customer_name} | {order.customer_mobile}
            </Text>
            <Text fontSize="sm" mb={2}>
              Date: {new Date(order.created_at).toLocaleString()}
            </Text>
            <Divider my={3} />

            <VStack spacing={2} align="stretch">
              {orderItems.map((item) => (
                <HStack key={item.id} justify="space-between">
                  <Text>
                    {item.item_name} × {item.quantity}
                  </Text>
                  <Text>₹{(item.price_per_item * item.quantity).toFixed(2)}</Text>
                </HStack>
              ))}
            </VStack>

            <Divider my={3} />
            <VStack spacing={1} align="stretch">
              <HStack justify="space-between">
                <Text>Subtotal</Text>
                <Text>₹{subtotal.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>GST (5%)</Text>
                <Text>₹{gst.toFixed(2)}</Text>
              </HStack>
              <Divider />
              <HStack justify="space-between" fontWeight="bold">
                <Text>Total</Text>
                <Text>₹{grandTotal.toFixed(2)}</Text>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Actions */}
        {status === "success" && (
          <Button colorScheme="blue" onClick={handlePrint}>
            Print Invoice
          </Button>
        )}
        <Button colorScheme="teal" onClick={() => (window.location.href = "/")}>
          Back to Home
        </Button>
      </VStack>

      {/* Print-only CSS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .invoice, .invoice * {
              visibility: visible;
            }
            .invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </>
  );
}
