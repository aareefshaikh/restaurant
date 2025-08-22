import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  HStack,
  useDisclosure,
  Image,
  useToast,
  IconButton
} from "@chakra-ui/react";
import { supabase } from "../../supabase";
import CreateEditMenuItem from "./CreateEditMenuItem";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

type MenuItem = {
  id: number;
  name: string;
  category_id: number | null;
  price: number;
  is_available: boolean;
  image_url: string;
};

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from<string, Category>("category").select("id, name, parent_id");
    const { data: menuData } = await supabase
      .from<string, MenuItem>("menu_item")
      .select("id, name, category_id, price, is_available, image_url")
      .order("name");

    setCategories(catData || []);
    setMenuItems(menuData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (id: number | null) => categories.find((c) => c.id === id)?.name || "-";

  const handleDelete = async (item: MenuItem) => {
    if (!confirm("Are you sure you want to delete this item?"))
      return;

    if (item.image_url) {
      debugger;
      const { error: delError } = await supabase.storage.from("isra-cafe").remove([item.image_url]);

      if (delError) {
        toast({ title: `Failed to delete the image ${delError?.message}`, status: "error" });
        return
      }
    }

    const { error } = await supabase.from("menu_item").delete().eq("id", item.id);
    if (error) console.error(error);
    else fetchData();
  };

  if (loading) return <Spinner size="xl" />;

  const getUrl = (item: MenuItem) => supabase.storage.from("isra-cafe").getPublicUrl(item.image_url).data.publicUrl;

  const onSubmit = async (data: any) => {

    let filePath = editingItem?.image_url;

    // If new image uploaded
    if (data.image && data.image[0]) {

      // Delete old file if exists
      if (editingItem?.image_url) {
        const { error: delError } = await supabase.storage.from("isra-cafe").remove([editingItem.image_url]);
        if (delError) {
          toast({ title: `Failed to delete the previous image - ${delError?.message}`, status: "error" });
          return;
        }
      }

      // Upload new file
      const file = data.image[0];
      filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("isra-cafe")
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        toast({ title: `Failed to upload the image - ${uploadError?.message}`, status: "error" });
          return;
      }
    }

    if (editingItem) {
      // update
      const { error } = await supabase.from("menu_item").update({
        name: data.name,
        price: data.price,
        is_available: data.is_available,
        category_id: data.category_id,
        image_url: filePath,
      }).eq("id", editingItem.id);
      
      if (error) {
        toast({ title: "Failed to update menu item", description: error?.message, status: "error" });
      }
    } else {
      // create
      const { error } = await supabase.from("menu_item").insert({
        name: data.name,
        price: data.price,
        is_available: data.is_available,
        category_id: data.category_id,
        image_url: filePath,
      });

      if (error) {
        toast({ title: "Failed to create menu item", description: error?.message, status: "error" });
      }
    }

    onClose();
    setEditingItem(null);
    fetchData();
  };

  const closeModal = () => {
    onClose();
    setEditingItem(null);
  };

  return (
    <Box>
      <Flex justify="flex-end" mb={4}>
        <IconButton
          aria-label="Create Menu Item"
          icon={<AddIcon />}
          onClick={onOpen}
          variant="solid"
          colorScheme="blue"
        />
        <CreateEditMenuItem
          editingItem={editingItem}
          isOpen={isOpen}
          onClose={closeModal}
          categories={categories}
          onCreated={fetchData} // refresh table after creation
          onSubmit={onSubmit}
        />
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th isNumeric>Price</Th>
            <Th>Available</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {menuItems.map((item) => (
            <Tr key={item.id}>
              <Td>
                {item.image_url ? <Image boxSize="50px" objectFit="cover" src={getUrl(item)} alt={item.name} /> : "-"}
              </Td>
              <Td>{item.name}</Td>
              <Td>{getCategoryName(item.category_id)}</Td>
              <Td isNumeric>₹{item.price}</Td>
              <Td>{item.is_available ? "Yes" : "No"}</Td>
              <Td>
                <HStack spacing={2}>
                  
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => { setEditingItem(item); onOpen(); }}
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    />

                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(item)}
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
