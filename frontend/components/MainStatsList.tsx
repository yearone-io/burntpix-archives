import React from "react";
import { List, ListItem, ListIcon, Box, Flex, Text } from "@chakra-ui/react";
import { MdLens } from "react-icons/md"; // This is an example icon from 'react-icons'
import { inter } from "@/app/fonts";

interface StatsItem {
  label: string;
  value: string;
}

interface StatsListProps {
  stats: StatsItem[];
}

const MainStatsList: React.FC<StatsListProps> = ({ stats }) => {
  const bulletColor = "#FE005B";

  return (
    <Box p={"20px 10%"} w={"100%"}>
      <List spacing={1}>
        {stats.map((item, index) => (
          <ListItem key={index}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text
                as="span"
                flex="1"
                textAlign="left"
                fontWeight={500}
                fontSize="16px"
                lineHeight="26px"
                fontFamily={inter.style.fontFamily}
                letterSpacing={1.5}
              >
                <ListIcon
                  as={MdLens}
                  color={bulletColor}
                  mr="2"
                  h="9px"
                  w="9px"
                  mb="1.5"
                />
                {item.label}
              </Text>
              <Text
                as="span"
                textAlign="right"
                fontWeight={800}
                fontSize="16px"
                lineHeight="26px"
                fontFamily={inter.style.fontFamily}
                letterSpacing={1.5}
              >
                {item.value}
              </Text>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MainStatsList;
