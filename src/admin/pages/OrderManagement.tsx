import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { supabase } from "../../supabase";

interface Order {
  id: string;
  customer_name: string;
  customer_mobile: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: string;
  item_name: string;
  quantity: number;
  price_per_item: number;
}

const GST_PERCENTAGE = 0.18;

const OrderManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("order")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error fetching orders", status: "error" });
    else setOrders(data || []);
    setLoading(false);
  };

  const fetchOrderItems = async (order: Order) => {
    setSelectedOrder(order);
    const { data, error } = await supabase
      .from("order_item")
      .select("*")
      .eq("order_id", order.id);
    if (error) toast({ title: "Error fetching items", status: "error" });
    else setSelectedOrderItems(data || []);
    onOpen();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await supabase.from("order").update({ status }).eq("id", orderId);
    if (error) toast({ title: "Error updating status", status: "error" });
    else {
      toast({ title: "Status updated", status: "success" });
      fetchOrders();
    }
  };

  if (loading) return <Spinner size="xl" />;

  const subtotal = selectedOrderItems.reduce(
    (sum, item) => sum + item.price_per_item * item.quantity,
    0
  );
  const gst = subtotal * GST_PERCENTAGE;
  const total = subtotal + gst;

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4}>Order Management</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Customer</Th>
            <Th>Mobile</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customer_name}</Td>
              <Td>{order.customer_mobile}</Td>
              <Td>₹{order.total_amount}</Td>
              <Td>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                  <option value="ORDER_PLACED">ORDER_PLACED</option>
                  <option value="ORDER_IN_PREPARATION">ORDER_IN_PREPARATION</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="COMPLETED">CANCELLED</option>
                </Select>
              </Td>
              <Td>
                <IconButton
                  aria-label="View Order"
                  icon={<ViewIcon />}
                  onClick={() => fetchOrderItems(order)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Decorative Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {selectedOrderItems.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  borderRadius="md"
                  shadow="sm"
                  borderWidth="1px"
                  _hover={{ shadow: "md" }}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{item.item_name}</Text>
                    <Badge colorScheme="green">₹{item.price_per_item}</Badge>
                  </HStack>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Total: ₹{(item.quantity * item.price_per_item).toFixed(2)}</Text>
                </Box>
              ))}

              <Divider />

              <Box>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Subtotal:</Text>
                    <Text>₹{subtotal.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">GST (18%):</Text>
                    <Text>₹{gst.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total:</Text>
                    <Text fontWeight="bold">₹{total.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderManagement;
