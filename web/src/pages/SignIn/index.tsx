import { Button, ButtonProps, Flex, Stack, Text } from '@chakra-ui/react';
import googleLogo from '../../assets/google-logo.png';

const SocialButton = (props: ButtonProps) => {
  return (
    <Button
      bgColor="white"
      color="blue.300"
      paddingX="25px"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      {...props}
    >
      <img src={googleLogo} alt="Google logo" style={{ width: '20px' }} />
      <Text ml="8px" fontWeight={500}>
        Google
      </Text>
    </Button>
  );
};

export function SignIn() {
  return (
    <Flex
      as="main"
      bgColor="blue.900"
      color="white"
      height={{
        base: 'calc(100vh - var(--headerHeightMobile))',
        md: 'calc(100vh - var(--headerHeight))',
      }}
      justify="center"
    >
      <Stack
        mt="100px"
        bgColor="gray.300"
        color="gray.500"
        width="400px"
        height="fit-content"
        padding="40px"
        filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
        borderRadius="10px"
        direction="column"
        align="center"
        spacing="16px"
      >
        <Text>Sign In with</Text>
        <SocialButton />
        <Text>Or sign up with</Text>
        <SocialButton />
      </Stack>
    </Flex>
  );
}
