import { Flex, Stack, Text } from '@chakra-ui/react';
import GoogleLogin from 'react-google-login';
import { useAuth } from '../../hooks';

export function SignIn() {
  const { googleClientId, onGoogleSignInSuccess, onGoogleSignUpSuccess } =
    useAuth();

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
        <GoogleLogin
          clientId={googleClientId}
          onSuccess={onGoogleSignInSuccess}
          buttonText="Google"
        />
        <Text>Or sign up with</Text>
        <GoogleLogin
          clientId={googleClientId}
          onSuccess={onGoogleSignUpSuccess}
          buttonText="Google"
        />
      </Stack>
    </Flex>
  );
}
