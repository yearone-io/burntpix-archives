import React, { useContext } from "react";
import { Box, Button, Flex, Image, useToast } from "@chakra-ui/react";
import { WalletContext } from "./wallet/WalletContext";
import { inter } from "@/app/fonts";

const SignInButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { connect, isLoadingAccount, networkConfig, connectedChainId } =
    walletContext;
  const toast = useToast();
  const fontDimensions = { base: "0.75rem", md: "0.85rem" };

  const onSignInClick = async () => {
    if (connectedChainId !== networkConfig.chainId) {
      try {
        await window.lukso.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: "0x" + BigInt(networkConfig.chainId).toString(16) },
          ],
        });
      } catch (error: any) {
        toast({
          title: `Error switching network. ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }
    try {
      await connect();
    } catch (error: any) {
      toast({
        title: `Failed to connect wallet: ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      onClick={onSignInClick}
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
        <Box
          fontSize={fontDimensions}
          lineHeight={fontDimensions}
        >
          {isLoadingAccount ? "..." : "SIGN IN"}
        </Box>
      </Flex>
    </Button>
  );
};

export default SignInButton;
