import React, { useContext } from "react";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { WalletContext } from "./wallet/WalletContext";
import { inter } from "@/app/fonts";

const SignInButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { connect, isLoadingAccount, networkConfig, connectedChainId } =
    walletContext;
  const fontDimensions = { base: "0.75rem", md: "0.85rem" };

  return (
    <Button
      onClick={connect}
      border={"1px solid #000000"}
      backgroundColor={"transparent"}
      fontFamily={inter.style.fontFamily}
      p="10px"
      borderRadius={"12px"}
      size={{ base: "xs", md: "sm" }}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        gap={{ base: "4px", md: "8px" }}
      >
        <Image
          src="/images/LYX-logo.svg"
          alt="Sign In"
          height={fontDimensions}
        />
        <Box fontSize={fontDimensions} lineHeight={fontDimensions}>
          {isLoadingAccount ? "..." : "SIGN IN"}
        </Box>
      </Flex>
    </Button>
  );
};

export default SignInButton;
