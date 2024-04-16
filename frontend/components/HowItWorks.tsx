"use client";
import React from "react";
import {
  VStack,
  Flex,
  Image,
  Text,
  Box,
  Heading,
  Center,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { newRockerFont, inter } from "@/app/fonts";

function HowItWorks() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button p={12} backgroundColor={"lukso.pink"} onClick={onOpen}>
        <VStack fontSize={24} fontWeight={900} color={"white"}>
          <Text fontFamily={inter.style.fontFamily} fontWeight={900}>New here? Click me!</Text>
          <Text fontFamily={newRockerFont.style.fontFamily} fontWeight={900}>Archiving 101 🔥🖼📂</Text>
        </VStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={800}>
          <ModalCloseButton color={"white"} />
          <ModalBody p={0}>
            <VStack
              align="stretch"
              borderColor={"lukso.pink"}
              borderWidth={1}
              spacing={0}
            >
              <Center height={48} backgroundColor={"lukso.pink"}>
                <Heading
                  textColor={"white"}
                  fontFamily={newRockerFont.style.fontFamily}
                >
                  Archiving 101
                </Heading>
              </Center>

              <Flex
                padding={8}
                direction={["row", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Image src="/images/step1.png" alt="Image 1" mb={"4"} />
                <Box>
                  <Heading
                    size="md"
                    textColor={"lukso.pink"}
                    fontFamily={newRockerFont.style.fontFamily}
                  >
                    1. Refine BurntPix
                  </Heading>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    A BurntPix NFT was locked in our vault for “archiving”. It
                    can continue to evolve if you refine it by contributing
                    iterations to the algorithm generating its art. Refining
                    requires you to “burn” some $LYX in the process, and that’s
                    where the “Burnt” in BurntPix comes from.
                  </Text>
                </Box>
              </Flex>

              <Flex
                padding={8}
                direction={["row", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Box>
                  <Heading
                    size="md"
                    textColor={"lukso.pink"}
                    fontFamily={newRockerFont.style.fontFamily}
                  >
                    2. Unlock Archive Levels
                  </Heading>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    Grow your refinement contributions to generate and unlock
                    new archives of the original BurntPix NFT. The archives are
                    lower resolution (25 x 25) copies of the original at the
                    particular point in time that they were generated during are
                    themselves NFTs.
                  </Text>
                </Box>
                <Image src="/images/step2.png" alt="Image 2" mt={"4"} />
              </Flex>

              <Flex
                padding={8}
                direction={["row", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Image src="/images/step3.png" alt="Image 3" mb={"4"} />
                <Box>
                  <Heading
                    size="md"
                    textColor={"lukso.pink"}
                    fontFamily={newRockerFont.style.fontFamily}
                  >
                    3. Mint Archives Level NFTs
                  </Heading>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    Mint your Archive NFT at each level to see it in its full
                    color. Or save it for later. But keep in mind that although
                    the ability to unlock new levels is uncapped there will be a
                    max supply of 1,000 Minted Archive NFTs.
                  </Text>
                </Box>
              </Flex>

              <Flex
                padding={8}
                direction={["row", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Box>
                  <Heading
                    size="md"
                    textColor={"lukso.pink"}
                    fontFamily={newRockerFont.style.fontFamily}
                  >
                    4. Win the Original BurntPix NFT
                  </Heading>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    Here for the Glory? Think you have the scripting prowess or
                    patience necessary to outrefine everyone around you? Prove
                    yourself and surpass the 69,420,000 contributed iterations
                    threshold to unlock and win the original BurntPix NFT from
                    within the vault.
                  </Text>
                </Box>
                <Image src="/images/step4.png" alt="Image 4" mt={"4"} />
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default HowItWorks;
