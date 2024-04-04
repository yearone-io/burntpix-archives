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

const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
};

const RefineButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const { account, provider, networkConfig } = walletContext;
  const defaultIterations = 100;
  const [selectedIterations, setSelectedIterations] =
    useState(defaultIterations);
  const toast = useToast();
  const maxIterations = 10000;
  const defaultRed = "#FE005B";
  const [inputValue, setInputValue] = useState(defaultIterations.toString());
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );
  // Debounce the Number input field so multiple values can be entered
  const debouncedSetSelectedIterations = debounce((value: number) => {
    let newVal = Math.min(Math.max(0, value), maxIterations);
    setSelectedIterations(newVal);
  }, 800);

  useEffect(() => {
    const valueAsNumber = parseInt(inputValue, 10);
    if (!isNaN(valueAsNumber)) {
      debouncedSetSelectedIterations(valueAsNumber);
    }
  }, [inputValue]);

  const refine = async () => {
    try {
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

  const handleInputChange = (valueAsString: string) => {
    setInputValue(valueAsString);
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
                <NumberInput
                  mb="4"
                  defaultValue={defaultIterations}
                  min={0}
                  max={maxIterations}
                  value={inputValue}
                  onChange={(valueAsString) => handleInputChange(valueAsString)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Slider
                  defaultValue={defaultIterations}
                  min={0}
                  max={maxIterations}
                  step={1}
                  value={selectedIterations}
                  onChange={(val) => {
                    setSelectedIterations(val);
                    setInputValue(val.toString());
                  }}
                >
                  <SliderTrack bg="gray.200">
                    <SliderFilledTrack bg={defaultRed} />
                  </SliderTrack>
                  <SliderThumb boxSize={6} bg={defaultRed} />
                </Slider>
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
