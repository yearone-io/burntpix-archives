import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { WalletContext } from "@/components/wallet/WalletContext";
import { BurntPixArchives__factory } from "@/contracts";
import SignInButton from "./SignInButton";
import { inter } from "@/app/fonts";

const RefineButton: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const {
    account,
    provider,
    networkConfig,
    signer,
    disconnectIfNetworkChanged,
  } = walletContext;
  const defaultIterations = 100;
  const [selectedIterations, setSelectedIterations] =
    useState(defaultIterations);
  const [selectedIterationsDebounce, setSelectedIterationsDebounce] =
    useState(selectedIterations);
  const [refineGasEstimate, setRefineGasEstimate] = useState<
    bigint | undefined | null
  >();
  const [isRefining, setIsRefining] = useState(false);
  const toast = useToast();
  const maxIterations = 10000;
  const defaultRed = "#FE005B";
  const maxGasLimit = 42000000;
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setSelectedIterationsDebounce(selectedIterations);
    }, 750); // 750ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [selectedIterations]);

  useEffect(() => {
    const savedIterations = localStorage.getItem("selectedIterations");
    if (savedIterations) {
      setSelectedIterations(Number(savedIterations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedIterations", selectedIterations.toString());
    const verifyGasEstimate = async () => {
      if (await disconnectIfNetworkChanged()) {
        return;
      }
      try {
        setRefineGasEstimate(undefined);
        const gasLimit = await burntPixArchives
          .connect(signer)
          ["refineToArchive(uint256)"].estimateGas(selectedIterations);
        const adjustedGasLimit = (gasLimit * BigInt(110)) / BigInt(100); //add 10% buffer
        if (adjustedGasLimit > BigInt(maxGasLimit)) {
          setRefineGasEstimate(null);
        } else {
          setRefineGasEstimate(adjustedGasLimit);
        }
      } catch (error: any) {
        if (error.action === "estimateGas") {
          setRefineGasEstimate(null);
        } else {
          let message = error.message;
          if (error.info?.error?.message) {
            message = error.info.error.message;
          }
          toast({
            title: message,
            status: "error",
            position: "bottom-left",
            duration: null,
            isClosable: true,
          });
        }
      }
    };
    if (signer) {
      verifyGasEstimate();
    }
  }, [selectedIterationsDebounce, signer]);

  const refine = async () => {
    if (await disconnectIfNetworkChanged()) {
      return;
    }
    setIsRefining(true);
    try {
      const signer = await provider.getSigner();
      await burntPixArchives
        .connect(signer)
        ["refineToArchive(uint256)"](selectedIterations, {
          gasLimit: refineGasEstimate,
        });
      setIsRefining(false);
      toast({
        title: "Refining successful!",
        status: "success",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      setIsRefining(false);
      let message = "Error refining: ";
      if (error.code === "ACTION_REJECTED") {
        message += "Transaction rejected.";
      } else if (error.action === "estimateGas") {
        message +=
          "Error estimating gas, try with a lower number of iterations.";
      } else if (error.shortMessage === "could not coalesce error") {
        message +=
          "Transaction rejected. Try again with higher gas and/or a lower number of iterations.";
      } else {
        message += error.message;
      }
      toast({
        title: message,
        status: "error",
        position: "bottom-left",
        duration: null,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {account ? (
        <Flex
          flexDirection={"column"}
          alignItems="flex-end"
          justifyContent="center"
          w="100%"
        >
          <Flex alignItems="center" justifyContent={"center"}>
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
              loadingText={"REFINING..."}
              isLoading={isRefining}
              isDisabled={!refineGasEstimate}
            >
              {refineGasEstimate === null
                ? "REFINE WILL FAIL"
                : "REFINE TO ARCHIVE"}
            </Button>
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  size="sm"
                  variant="ghost"
                  p={0}
                  ml={2}
                  isLoading={isRefining}
                >
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
                      min={1}
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
                      min={1}
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
          <HStack>
            {refineGasEstimate === null && (
              <Text
                fontSize="sm"
                fontWeight={"bold"}
                color={defaultRed}
                fontFamily={inter.style.fontFamily}
              >
                Please reduce iterations amount!
              </Text>
            )}
            {refineGasEstimate === undefined && (
              <Text
                fontSize="sm"
                fontWeight={"bold"}
                color={defaultRed}
                fontFamily={inter.style.fontFamily}
              >
                <Spinner mr={2} size={"xs"} color={defaultRed} />
                Running refinement simulation
              </Text>
            )}
            {refineGasEstimate !== null && refineGasEstimate !== undefined && (
              <Text
                fontSize="sm"
                fontWeight={500}
                color={defaultRed}
                fontFamily={inter.style.fontFamily}
              >
                {`+ ${selectedIterations} iterations`}
              </Text>
            )}
          </HStack>
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
