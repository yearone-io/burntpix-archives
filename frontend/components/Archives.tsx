import React, { useState } from "react";
import { Flex, HStack, IconButton, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const Archives = ({ images }: { images: string[] }) => {
  const [startIndex, setStartIndex] = useState(0);

  // Use the useBreakpointValue hook to determine the number of images to slide
  const slideAmount = useBreakpointValue({ base: 1, md: 5 }) || 5; // 1 image for base (mobile), 5 for md (tablet) and up

  const nextSlide = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + slideAmount, images.length - 1));
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - slideAmount, 0));
  };

  return (
    <VStack alignItems={"left"}>
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
        />
        <Flex maxW={'100%'}>
          {images.slice(startIndex, startIndex + slideAmount).map((image, index) => (
            <VStack alignItems={"left"} key={index} flex="0 0 auto" width={slideAmount === 1 ? "100%" : "20%"}>
              <img
                src={image}
                alt={`Brunt Pix ${index + startIndex + 1}`}
                height={slideAmount === 1 ? "200px": "100px"}
                width={slideAmount === 1 ? "200px": "100px"}
              />
              <Text>{index + startIndex + 1}</Text>
            </VStack>
          ))}
        </Flex>
        <IconButton
          onClick={nextSlide}
          icon={<FaArrowCircleRight />}
          aria-label={"Next"}
        />
      </HStack>
    </VStack>
  );
};

export default Archives;
