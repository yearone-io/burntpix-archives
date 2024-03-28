import React from "react";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { inter } from "@/app/fonts";

const RefineButton: React.FC = () => {
  const buttonBgColor = "#FE005B";
  const buttonTextColor = "white";
  const iconButtonSize = "24px";

  return (
    <Flex align="center" justify="right">
      <Button
        bg={buttonBgColor}
        color={buttonTextColor}
        _hover={{ bg: "red.600" }}
        borderRadius={10}
        h="30px"
        w="70px"
        fontSize="14px"
        fontFamily={inter.style.fontFamily}
        fontWeight={700}
      >
        REFINE
      </Button>

      <Button
        size="sm"
        variant="ghost"
        color={buttonBgColor}
        _hover={{ color: "red.600" }}
        p={0}
      >
        <Icon as={MdSettings} boxSize={iconButtonSize} />
      </Button>
    </Flex>
  );
};

export default RefineButton;
