"use client";
import { ptSerifBold, inter } from "@/app/fonts";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  description?: string;
  children: ReactNode;
}

const Article: React.FC<Props> = ({ title, description, children }) => {
  const margin = useBreakpointValue({ base: "0", md: "20px" });

  return (
    <Box ml={margin} mr={margin} mt="20px" mb="20px">
      <Box
        color="#FE005B"
        fontWeight={900}
        fontSize="md"
        lineHeight="17px"
        letterSpacing={1.5}
        fontFamily={inter.style.fontFamily}
      >
        {title}
      </Box>
      {description && (
        <Box
          color="#000000"
          fontWeight={600}
          fontSize="xl"
          lineHeight="34.5px"
          fontFamily={ptSerifBold.style.fontFamily}
          mt="10px"
        >
          {description}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  );
};

export default Article;
