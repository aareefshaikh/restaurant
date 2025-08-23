import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingItem?: any; // menu item if editing
  categories: any[];
  onCreated?: () => void;
}

export default function CreateEditMenuItem({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  categories,
}: MenuFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // prefill form on edit
  useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        price: editingItem.price,
        is_available: editingItem.is_available,
        category_id: editingItem.category_id,
        position: editingItem.position,
      });
    } else {
      reset({
        name: "",
        price: "",
        is_available: true,
        category_id: "",
        position: "",
      });
    }
  }, [editingItem, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{editingItem ? "Edit Item" : "Add Item"}</ModalHeader>
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Name</FormLabel>
            <Input {...register("name", { required: true })} />
            {errors.name && <Box color="red.400">Name is required</Box>}
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              step="0.01"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Only up to 2 decimal places allowed",
                },
              })}
            />
            {errors.price && <Box color="red.400">Price is required</Box>}
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Category</FormLabel>
            <Select {...register("category_id", { required: true })}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.category_id && (
              <Box color="red.400">Category is required</Box>
            )}
          </FormControl>

          <FormControl mb={3} display="flex" alignItems="center">
            <FormLabel mb="0">Available</FormLabel>
            <Switch {...register("is_available")} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Position</FormLabel>
            <Input
              type="number"
              step="1"
              placeholder="Enter position"
              {...register("position", {
                required: "Position is required",
                pattern: {
                  value: /^-?\d+$/,
                  message: 'Only integers allowed'
                },
              })}
            />
            {errors.price && <Box color="red.400">Position is required</Box>}
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Image</FormLabel>
            <Input type="file" accept="image/*" {...register("image")} />
            {/* not required in edit */}
            {!editingItem && errors.image && (
              <Box color="red.400">Image is required</Box>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            {editingItem ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
