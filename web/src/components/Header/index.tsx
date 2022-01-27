import { useState } from 'react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  ListItem,
  UnorderedList,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
interface MenuLink {
  to: string;
  text: string;
}

const menuLinks: MenuLink[] = [
  {
    to: routes.home.path,
    text: 'Home',
  },
  {
    to: routes.signIn.path,
    text: 'Sign In',
  },
];

const authenticatedMenuLinks: MenuLink[] = [
  {
    to: routes.dashboard.path,
    text: 'Dashboard',
  },
  {
    to: routes.myAccount.path,
    text: 'My Account',
  },
  {
    to: routes.signOut.path,
    text: 'Sign Out',
  },
];

interface Props {
  isAuthenticated: boolean;
}

export const Header = ({ isAuthenticated }: Props) => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = isAuthenticated ? authenticatedMenuLinks : menuLinks;

  return (
    <Box as="header" width="100vw" bgColor="blue.900" zIndex={1}>
      <Flex
        justify="space-between"
        align="center"
        marginX="auto"
        maxWidth="var(--maxWidth)"
        paddingX="16px"
        color="white"
        height={{ base: '50px', md: '200px' }}
      >
        <Box>
          <Link to={routes.home.path}>
            <Text fontWeight={500} fontSize={{ base: '20px', md: '40px' }}>
              weStudy
            </Text>
          </Link>
        </Box>

        <IconButton
          onClick={() => setIsOpen(state => !state)}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          fontSize={isOpen ? '20px' : '30px'}
          aria-label="Open/Close menu"
          background="blue.900"
          display={{ base: 'block', md: 'none' }}
        />

        <UnorderedList
          position={{ base: 'absolute', md: 'unset' }}
          top={{ base: '49px', md: '0' }}
          left={{ base: '-16px', md: '0' }}
          width={{ base: isOpen ? '100vw' : '0', md: 'auto' }}
          height={{ base: 'calc(100vh - 49px)', md: 'auto' }}
          transition="0.3s ease-in-out"
        >
          <Flex
            as="nav"
            direction={{ base: 'column', md: 'row' }}
            bgColor="blue.900"
            width={{ base: '100%', md: 'auto' }}
            height={{ base: '100%', md: 'auto' }}
            align={{ base: 'center', md: 'start' }}
            overflow="hidden"
          >
            {links.map(menuLink => {
              const isActive = pathname === menuLink.to;
              return (
                <ListItem
                  key={menuLink.to}
                  marginLeft={{ base: 0, md: '30px' }}
                  padding={{ base: '20px' }}
                  width="fit-content"
                >
                  <NavLink to={menuLink.to}>
                    <Text
                      fontSize="22px"
                      color={isActive ? 'blue.300' : 'white'}
                      borderBottom={isActive ? '1px solid' : '0'}
                      textAlign="center"
                    >
                      {menuLink.text}
                    </Text>
                  </NavLink>
                </ListItem>
              );
            })}
          </Flex>
        </UnorderedList>
      </Flex>
    </Box>
  );
};
