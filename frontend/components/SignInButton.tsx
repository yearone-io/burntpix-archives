import React, { useContext } from "react";
import { Box, Button, Flex, Image, useToast } from "@chakra-ui/react";
import { WalletContext } from "./wallet/WalletContext";
import { inter } from "@/app/fonts";

const SignInButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { connect, isLoadingAccount, networkConfig, connectedChainId } =
    walletContext;
  const toast = useToast();

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
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Image src="/images/LYX-logo.svg" alt="Sign In" />
        <Box
          ml="10px"
          fontSize="sm"
          fontWeight="700"
          fontFamily={inter.style.fontFamily}
        >
          {isLoadingAccount ? "..." : "SIGN IN"}
        </Box>
      </Flex>
    </Button>
  );
};

export default SignInButton;
