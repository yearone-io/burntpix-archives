import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

// Updated the shape of props expected by the Article component to include title and description.
interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const Article: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Box m='20px' w='400px'>
      <Box color='#FE005B' fontWeight={900} fontSize='14px' lineHeight='17px'>{title}</Box>
      <Box color='#000000' fontWeight={600} fontSize='26px' lineHeight='34.5px'>{description}</Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default Article;
