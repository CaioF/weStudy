import { Box, Flex, Text, Heading } from '@chakra-ui/react';
import { Button } from '../../components/Button';
import img from '../../assets/planet-system.png';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';

export function Home() {
  return (
    <Flex
      as="main"
      bgColor="blue.900"
      color="white"
      height={{
        base: 'calc(100vh - var(--headerHeightMobile))',
        md: 'calc(100vh - var(--headerHeight))',
      }}
      justify={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Box
        width={{ base: '200px', md: '500px' }}
        alignSelf={{ base: 'center', md: 'unset' }}
      >
        <img
          src={img}
          alt="Planetary system"
          style={{ borderRadius: '50%', width: '100%' }}
        />
      </Box>

      <Flex
        height="fit-content"
        mt={{ base: '0', md: '150px' }}
        ml={{ base: '0', md: '50px' }}
        direction="column"
        textAlign={{ base: 'center', md: 'right' }}
        paddingX="30px"
        alignSelf={{ base: 'center', md: 'unset' }}
      >
        <Heading mb="20px">Welcome to Lorem Ipsum</Heading>

        <Text maxWidth="500px" mb="20px" alignSelf="flex-end">
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content
        </Text>

        <Link to={routes.signIn.path}>
          <Button
            buttonType="ghost"
            alignSelf={{ base: 'center', md: 'flex-end' }}
            width={{ base: '100%', md: 'fit-content' }}
          >
            Sign In
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
