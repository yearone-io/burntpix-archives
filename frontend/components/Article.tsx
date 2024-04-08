import { ptSerifBold, inter } from "@/app/fonts";
import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  description?: string;
  children: ReactNode;
}

const Article: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Box width={"100%"} minW={"xs"}>
      <Box
        color="#FE005B"
        fontWeight={900}
        fontSize="md"
        lineHeight="17px"
        letterSpacing={1.5}
        fontFamily={inter.style.fontFamily}
        mb="10px"
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
        >
          {description}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  );
};

export default Article;
