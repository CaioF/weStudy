import { useState } from "react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  ListItem,
  UnorderedList,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth, useModal } from "../../hooks";
import { MyAccount } from "../MyAccount";
interface MenuLink {
  to: string;
  text: string;
}

const menuLinks: MenuLink[] = [
  {
    to: routes.home.path,
    text: "Home",
  },
  {
    to: routes.signIn.path,
    text: "Sign In",
  },
];

const authenticatedMenuLinks: MenuLink[] = [
  {
    to: routes.dashboard.path,
    text: "Dashboard",
  },
];

export const Header = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { token, signOut } = useAuth();
  const { openModal } = useModal();

  const links = token ? authenticatedMenuLinks : menuLinks;

  return (
    <Box as="header" width="100vw" bgColor="blue.900">
      <Flex
        justify="space-between"
        align="center"
        marginX="auto"
        maxWidth="var(--maxWidth)"
        paddingX="16px"
        color="white"
        height={{
          base: "var(--headerHeightMobile)",
          md: "var(--headerHeight)",
        }}
      >
        <Box>
          <Link to={token ? routes.dashboard.path : routes.home.path}>
            <Text fontWeight={500} fontSize={{ base: "20px", md: "40px" }}>
              weStudy
            </Text>
          </Link>
        </Box>

        <IconButton
          onClick={() => setIsOpen((state) => !state)}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          fontSize={isOpen ? "20px" : "30px"}
          aria-label="Open/Close menu"
          background="blue.900"
          display={{ base: "block", md: "none" }}
        />

        <UnorderedList
          position={{ base: "absolute", md: "unset" }}
          top={{ base: "49px", md: "0" }}
          left={{ base: "-16px", md: "0" }}
          width={{ base: isOpen ? "100vw" : "0", md: "auto" }}
          height={{ base: "calc(100vh - 49px)", md: "auto" }}
          transition="0.3s ease-in-out"
          zIndex={999}
        >
          <Flex
            as="nav"
            direction={{ base: "column", md: "row" }}
            bgColor="blue.900"
            width={{ base: "100%", md: "auto" }}
            height={{ base: "100%", md: "auto" }}
            align={{ base: "center", md: "start" }}
            overflow="hidden"
          >
            {links.map((menuLink) => {
              const isActive = pathname === menuLink.to;
              return (
                <ListItem
                  key={menuLink.to}
                  marginLeft={{ base: 0, md: "30px" }}
                  padding={{ base: "20px" }}
                  width="fit-content"
                >
                  <NavLink to={menuLink.to}>
                    <Text
                      fontSize="22px"
                      color={isActive ? "blue.300" : "white"}
                      borderBottom={isActive ? "1px solid" : "0"}
                      textAlign="center"
                    >
                      {menuLink.text}
                    </Text>
                  </NavLink>
                </ListItem>
              );
            })}
            {token && (
              <>
                <ListItem
                  marginLeft={{ base: 0, md: "30px" }}
                  padding={{ base: "20px" }}
                  width="fit-content"
                >
                  <Text
                    onClick={() => openModal(<MyAccount />)}
                    fontSize="22px"
                    color="white"
                    borderBottom="0"
                    textAlign="center"
                    cursor="pointer"
                  >
                    My Account
                  </Text>
                </ListItem>

                <ListItem
                  marginLeft={{ base: 0, md: "30px" }}
                  padding={{ base: "20px" }}
                  width="fit-content"
                >
                  <Text
                    onClick={signOut}
                    fontSize="22px"
                    color="white"
                    borderBottom="0"
                    textAlign="center"
                    cursor="pointer"
                  >
                    Sign Out
                  </Text>
                </ListItem>
              </>
            )}
          </Flex>
        </UnorderedList>
      </Flex>
    </Box>
  );
};
