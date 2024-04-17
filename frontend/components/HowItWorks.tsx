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
      <Button p={10} backgroundColor={"lukso.pink"} onClick={onOpen}>
        <VStack fontSize={16} fontWeight={900} color={"white"}>
          <Text fontFamily={inter.style.fontFamily} fontWeight={900}>
            New here? Click me!
          </Text>
          <Text fontFamily={newRockerFont.style.fontFamily} fontWeight={900}>
            Archiving 101 🔥 🖼 📂
          </Text>
        </VStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay background={"var(--chakra-colors-whiteAlpha-900)"} />
        <ModalContent
          maxW={800}
          borderRadius={10}
          borderColor={"lukso.pink"}
          borderWidth={2}
        >
          <ModalCloseButton color={"white"} />
          <ModalBody p={0}>
            <VStack align="stretch" borderTopRadius={10} spacing={0}>
              <Center
                height={48}
                borderTopRadius={8}
                backgroundColor={"lukso.pink"}
              >
                <Heading
                  textColor={"white"}
                  fontFamily={newRockerFont.style.fontFamily}
                >
                  Archiving 101
                </Heading>
              </Center>

              <Flex
                padding={8}
                direction={["column", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                alignItems={"center"}
                gap={2}
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Image
                  maxWidth={400}
                  width={"100%"}
                  src="/images/step1.png"
                  alt="refine burntpix"
                  mb={"4"}
                />
                <Box>
                  <Flex gap={2} alignItems={"center"}>
                    <Flex
                      as={Heading}
                      size="md"
                      backgroundColor={"lukso.pink"}
                      color={"white"}
                      borderRadius={100}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontFamily={newRockerFont.style.fontFamily}
                      w={"40px"}
                      h={"40px"}
                    >
                      1
                    </Flex>
                    <Heading
                      size="md"
                      textColor={"lukso.pink"}
                      fontFamily={newRockerFont.style.fontFamily}
                    >
                      Refine BurntPix
                    </Heading>
                  </Flex>
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
                direction={[
                  "column-reverse",
                  "column-reverse",
                  "row",
                  "row",
                  "row",
                  "row",
                ]}
                justifyContent="center"
                alignItems={"center"}
                gap={2}
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Box>
                  <Flex gap={2} alignItems={"center"}>
                    <Flex
                      as={Heading}
                      size="md"
                      backgroundColor={"lukso.pink"}
                      color={"white"}
                      borderRadius={100}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontFamily={newRockerFont.style.fontFamily}
                      w={"40px"}
                      h={"40px"}
                    >
                      2
                    </Flex>
                    <Heading
                      size="md"
                      textColor={"lukso.pink"}
                      fontFamily={newRockerFont.style.fontFamily}
                    >
                      Unlock Archive Levels
                    </Heading>
                  </Flex>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    Grow your refinement contributions to generate and unlock
                    new archives of the original BurntPix NFT. The archives are
                    lower resolution (25 x 25) copies of the original at the
                    particular point in time that they were generated during are
                    themselves NFTs.
                  </Text>
                </Box>
                <Image
                  maxWidth={400}
                  width={"100%"}
                  src="/images/step2.png"
                  alt="unlock archive levels"
                  mt={"4"}
                />
              </Flex>

              <Flex
                padding={8}
                direction={["column", "column", "row", "row", "row", "row"]}
                justifyContent="center"
                alignItems={"center"}
                gap={2}
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Image
                  maxWidth={400}
                  width={"100%"}
                  src="/images/step3.png"
                  alt="mint archives"
                  mb={"4"}
                />
                <Box>
                  <Flex gap={2} alignItems={"center"}>
                    <Flex
                      as={Heading}
                      size="md"
                      backgroundColor={"lukso.pink"}
                      color={"white"}
                      borderRadius={100}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontFamily={newRockerFont.style.fontFamily}
                      w={"40px"}
                      h={"40px"}
                    >
                      3
                    </Flex>
                    <Heading
                      size="md"
                      textColor={"lukso.pink"}
                      fontFamily={newRockerFont.style.fontFamily}
                    >
                      Mint Archives Level NFTs
                    </Heading>
                  </Flex>
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
                direction={[
                  "column-reverse",
                  "column-reverse",
                  "row",
                  "row",
                  "row",
                  "row",
                ]}
                justifyContent="center"
                alignItems={"center"}
                gap={2}
                borderColor={"lukso.pink"}
                borderWidth={1}
              >
                <Box>
                  <Flex gap={2} alignItems={"center"}>
                    <Flex
                      as={Heading}
                      size="md"
                      backgroundColor={"lukso.pink"}
                      color={"white"}
                      borderRadius={100}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontFamily={newRockerFont.style.fontFamily}
                      w={"40px"}
                      h={"40px"}
                    >
                      4
                    </Flex>
                    <Heading
                      size="md"
                      textColor={"lukso.pink"}
                      fontFamily={newRockerFont.style.fontFamily}
                    >
                      Win the BurntPix NFT
                    </Heading>
                  </Flex>
                  <Text fontWeight={500} fontFamily={inter.style.fontFamily}>
                    Here for the Glory? Think you have the scripting prowess or
                    patience necessary to outrefine everyone around you? Prove
                    yourself and surpass the 69,420,000 contributed iterations
                    threshold to unlock and win the original BurntPix NFT from
                    within the vault.
                  </Text>
                </Box>
                <Image
                  maxWidth={400}
                  width={"100%"}
                  src="/images/step4.png"
                  alt="win original nft"
                  mt={"4"}
                />
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              bg={"lukso.pink"}
              color="white"
              _hover={{ bg: "lukso.pink" }}
              borderRadius={10}
              fontWeight={700}
              fontFamily={inter.style.fontFamily}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default HowItWorks;
