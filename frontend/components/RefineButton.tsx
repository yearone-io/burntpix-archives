import React, { useContext } from "react";
import { Box, Button, Flex, Icon, useToast } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { inter } from "@/app/fonts";
import { WalletContext } from "@/components/wallet/WalletContext";
import { BurntPixArchives__factory } from "@/contracts";
import SignInButton from "./SignInButton";

const RefineButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { account, provider, isLoadingAccount, networkConfig } = walletContext;
  const buttonTextColor = "white";
  const iconButtonSize = "24px";
  const buttonBgColor = account ? "#FE005B" : "grey";
  const hoverBgColor = account ? "red.600" : "grey";
  const buttonText = account ? "REFINE" : "CONNECT WALLET";
  const toast = useToast();
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  const selectedIteractions = 1;
  const refine = async () => {
    try {
     const signer = await provider.getSigner();
     await burntPixArchives.connect(signer)["refineToArchive(uint256)"](selectedIteractions)
    } catch (error: any) {
      toast({
        title: `Error refining. ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  };

  const clickOnSettings = () => {
  }

  return (
    <Box>
      {account ? (
        <Flex align="center" justify="right">
          <Button
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: hoverBgColor }}
            borderRadius={10}
            h="30px"
            w="fit-content"
            fontSize="md"
            fontFamily={inter.style.fontFamily}
            fontWeight={700}
            onClick={refine}
          >
            {buttonText}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            color={buttonBgColor}
            _hover={{ color: hoverBgColor }}
            p={0}
          >
            <Icon as={MdSettings} boxSize={iconButtonSize} />
          </Button>
        </Flex>
      ) : (
        <Flex align="center" justify="right">
         <SignInButton />
        </Flex>
      )}
    </Box>
  );
};

export default RefineButton;
