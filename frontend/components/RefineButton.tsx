import React, { useContext } from "react";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { inter } from "@/app/fonts";
import { WalletContext } from "@/components/wallet/WalletContext";

const RefineButton: React.FC = () => {
  const buttonTextColor = "white";
  const iconButtonSize = "24px";
  const walletContext = useContext(WalletContext);
  const { account } = walletContext;
  const buttonBgColor = account ? "#FE005B": 'grey';
  const hoverBgColor = account ? "red.600" : 'grey';
  const buttonText= account ? "REFINE" : "CONNECT WALLET";

  return (
    <Flex align="center" justify="right">
      <Button
        bg={buttonBgColor}
        color={buttonTextColor}
        _hover={{ bg: hoverBgColor }}
        borderRadius={10}
        h="30px"
        w='fit-content'
        fontSize="md"
        fontFamily={inter.style.fontFamily}
        fontWeight={700}
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
  );
};

export default RefineButton;
