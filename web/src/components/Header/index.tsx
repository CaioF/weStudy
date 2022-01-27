import { Box, Flex, ListItem, UnorderedList, Text } from '@chakra-ui/react';
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

export function Header() {
  const { pathname } = useLocation();

  return (
    <Box as="header" width="100vw" bgColor="blue.900">
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

        <UnorderedList>
          <Flex as="nav" width="100%" height="100%">
            {menuLinks.map(menuLink => {
              const isActive = pathname === menuLink.to;
              return (
                <ListItem key={menuLink.to} marginLeft="30px">
                  <NavLink to={menuLink.to}>
                    <Text
                      fontSize="22px"
                      color={isActive ? 'blue.300' : 'white'}
                      borderBottom={isActive ? '1px solid' : '0'}
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
}
