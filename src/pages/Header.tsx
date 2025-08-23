// Header.tsx
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
  Badge,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons"; // for logout
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // adjust path if needed

const Header: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cartCount = Object.values(cart).reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    clearCart();
    navigate("/");
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={4}
      py={2}
      bg="gray.100"
      boxShadow="sm"
    >
      {/* Logo */}
      <Link to="/">
        <HStack spacing={2} cursor="pointer">
          <Image src={logo} alt="Restaurant Logo" boxSize="40px" />
          <Text fontSize="lg" fontWeight="bold">
            Isra's Cafe
          </Text>
        </HStack>
      </Link>

      <HStack spacing={4}>
        {/* Cart */}
        <Box position="relative">
          <IconButton
            aria-label="Cart"
            icon={<Text fontWeight="bold">🛒</Text>}
            variant="ghost"
            size="lg"
            onClick={() => navigate("/cart")}
          />
          {cartCount > 0 && (
            <Badge
              position="absolute"
              top="0"
              right="0"
              colorScheme="red"
              borderRadius="full"
              px={2}
            >
              {cartCount}
            </Badge>
          )}
        </Box>

        {/* Profile dropdown */}
        <Menu>
          <MenuButton>
            <HStack>
              <Avatar size="sm" name={user.name || "Guest"} />
              <Text fontSize="sm">{user.name || "Guest"}</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<SmallCloseIcon />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header;
