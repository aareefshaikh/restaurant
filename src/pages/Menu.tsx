// src/pages/CustomerMenu.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "../supabase";
import { useCart } from "../context/CartContext";
import Header from "./Header";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  position: number;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
  position: number;
  menu_item: MenuItem[];
}

export default function CustomerMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { cart, addItem, removeItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("category")
        .select(`
          id,
          name,
          position,
          menu_item (
            id,
            name,
            price,
            image_url,
            position,
            is_available
          )
        `)
        .order("position", { ascending: true })
        .order("position", { referencedTable: "menu_item", ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const filtered = data?.filter(
        (cat) => cat.menu_item && cat.menu_item.length > 0
      );

      setCategories(filtered ?? []);
      setSelectedCat(filtered?.[0]?.id ?? null);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const activeCategory = categories.find((c) => c.id === selectedCat);

  const getUrl = (item: MenuItem) => supabase.storage.from("isra-cafe").getPublicUrl(item.image_url).data.publicUrl;

  return (
    <>
      <Header />

      <Flex h="100vh" overflow="hidden">
      {/* Left category nav */}
      <VStack
        w="200px"
        bg="gray.100"
        p={4}
        spacing={3}
        align="stretch"
        overflowY="auto"
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={cat.id === selectedCat ? "solid" : "ghost"}
            colorScheme="teal"
            justifyContent="flex-start"
            onClick={() => setSelectedCat(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </VStack>

      {/* Right items grid */}
      <Box flex="1" p={6} overflowY="auto">
        <Text fontSize="2xl" mb={4} fontWeight="bold">
          {activeCategory?.name}
        </Text>

        <Flex wrap="wrap" gap={6}>
          {activeCategory?.menu_item.map((item) => {
            const count = cart[item.id]?.quantity || 0;
            return (
              <Box
                key={item.id}
                w="220px"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                shadow="sm"
              >
                <Image
                  src={getUrl(item)}
                  alt={item.name}
                  w="100%"
                  h="140px"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Text fontWeight="semibold">{item.name}</Text>
                  <Text>₹{item.price}</Text>

                  <HStack mt={3}>
                    <Button size="sm" onClick={() => removeItem(item)}>
                      -
                    </Button>
                    <Text>{count}</Text>
                    <Button size="sm" onClick={() => addItem(item)}>
                      +
                    </Button>
                  </HStack>
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Flex>
    </>
  );
}
