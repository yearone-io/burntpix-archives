import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { WalletContext } from "@/components/wallet/WalletContext";
import { BurntPixArchives__factory } from "@/contracts";
import SignInButton from "./SignInButton";
import { inter } from "@/app/fonts";

const RefineButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { account, provider, networkConfig } = walletContext;
  const defaultIterations = 100;
  const [selectedIterations, setSelectedIterations] =
    useState(defaultIterations);
  const toast = useToast();
  const maxIterations = 10000;
  const defaultRed = "#FE005B";
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  const refine = async () => {
    try {
      console.log("Refining with iterations: ", selectedIterations);
      const signer = await provider.getSigner();
      await burntPixArchives
        .connect(signer)
        ["refineToArchive(uint256)"](selectedIterations);
    } catch (error: any) {
      toast({
        title: `Error refining. ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {account ? (
        <Flex align="center" justify="right">
          <Button
            bg={defaultRed}
            color="white"
            _hover={{ bg: defaultRed }}
            borderRadius={10}
            h="30px"
            w="fit-content"
            fontSize="md"
            fontWeight={700}
            onClick={refine}
            fontFamily={inter.style.fontFamily}
          >
            REFINE
          </Button>
          <Popover placement="top">
            <PopoverTrigger>
              <Button size="sm" variant="ghost" p={0} ml={2}>
                <Icon as={MdSettings} boxSize="24px" color={defaultRed} />
              </Button>
            </PopoverTrigger>
            <PopoverContent p="10px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text
                  mb="4"
                  fontWeight="bold"
                  fontFamily={inter.style.fontFamily}
                >
                  Adjust Iterations:
                </Text>
                <Flex flexDir="column">
                  <NumberInput
                    mb="4"
                    defaultValue={defaultIterations}
                    min={0}
                    max={maxIterations}
                    maxW="100px"
                    mr="2rem"
                    value={selectedIterations}
                    onChange={(value: string) => {
                      setSelectedIterations(Number(value));
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    flex="1"
                    defaultValue={defaultIterations}
                    min={0}
                    max={maxIterations}
                    step={1}
                    focusThumbOnChange={false}
                    value={selectedIterations}
                    onChange={setSelectedIterations}
                  >
                    <SliderTrack bg="gray.200">
                      <SliderFilledTrack bg={defaultRed} />
                    </SliderTrack>
                    <SliderThumb boxSize="15px" bg={defaultRed} />
                  </Slider>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
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
