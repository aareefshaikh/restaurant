import { VStack, Button } from "@chakra-ui/react";

function Sidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (section: string) => void;
}) {
  return (
    <VStack
      align="start"
      bg="gray.100"
      p={4}
      spacing={4}
      minW="200px"
      h="100vh"
    >
      <Button
        variant={selected === "orders" ? "solid" : "ghost"}
        onClick={() => onSelect("orders")}
        width="100%"
      >
        Orders
      </Button>
      <Button
        variant={selected === "menu" ? "solid" : "ghost"}
        onClick={() => onSelect("menu")}
        width="100%"
      >
        Menu Management
      </Button>
    </VStack>
  );
}

export default Sidebar;