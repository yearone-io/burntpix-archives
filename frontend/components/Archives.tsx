import React, { useState } from "react";
import { Flex, HStack, IconButton, Link, Text, VStack } from "@chakra-ui/react";
import { FaArrowCircleLeft, FaExternalLinkAlt } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

const Archives = ({ images }: { images: string[] }) => {
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 5, images.length - 1));
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  return (
    <VStack alignItems={"left"}>
      {/* <HStack>
        <Text color={"lukso.pink"} fontSize={"lg"} fontWeight={"900"}>
          ARCHIVES
        </Text> */}
      {/* <Link isExternal={true} href={"/"}>
          <IconButton
            aria-label="View archives"
            color={"lukso.pink"}
            icon={<FaExternalLinkAlt />}
            size="sm"
            variant="ghost"
          />
        </Link> */}
      {/* </HStack> */}
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
        ></IconButton>
        <Flex>
          {images.slice(startIndex, startIndex + 5).map((image, index) => (
            <VStack alignItems={"left"} key={index} flex="0 0 auto" width="20%">
              <img
                src={image}
                alt={`Brunt Pix ${index + startIndex + 1}`}
                height="100px"
                width="100px"
              />
              <Text>{index + startIndex + 1}</Text>
            </VStack>
          ))}
        </Flex>
        <IconButton
          onClick={nextSlide}
          icon={<FaArrowCircleRight />}
          aria-label={"Next"}
        ></IconButton>
      </HStack>
    </VStack>
  );
};

export default Archives;
