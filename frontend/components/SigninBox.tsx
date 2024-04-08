import React from "react";
import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import SignInButton from "@/components/SignInButton";
import { inter } from "@/app/fonts";

const SignInBox: React.FC = () => {
  return (
    <VStack
      spacing={4}
      p={5}
      boxShadow="md"
      borderRadius="lg"
      width="100%"
      mx="auto"
      my={8}
      textAlign="center"
      padding="20px"
    >
      <Text
        fontSize="lg"
        fontWeight="700"
        size="16px"
        lineHeight="19px"
        fontFamily={inter.style.fontFamily}
      >
        Please sign in with your Universal Profile to view your contributions
      </Text>
      <SignInButton />
    </VStack>
  );
};

export default SignInBox;
