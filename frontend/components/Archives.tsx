// components/CarouselGallery.js
import React, { useState } from "react";
import { Box, Flex, HStack, IconButton } from "@chakra-ui/react";
import { FaArrowCircleLeft } from "react-icons/fa";
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
    <HStack w="80%" mx="auto" overflow="hidden" position="relative">
      <IconButton
        icon={<FaArrowCircleLeft />}
        onClick={prevSlide}
        aria-label={"Previous"}
      ></IconButton>
      <Flex className="carousel" overflowX="hidden">
        {images.slice(startIndex, startIndex + 5).map((image, index) => (
          <Box key={index} flex="0 0 auto" width="20%">
            <img src={image} alt={`Image ${index + startIndex + 1}`} />
          </Box>
        ))}
      </Flex>
      <IconButton
        onClick={nextSlide}
        icon={<FaArrowCircleRight />}
        aria-label={"Next"}
      ></IconButton>
    </HStack>
  );
};

export default Archives;
