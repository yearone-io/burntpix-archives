import React from "react";
import { List, ListItem, ListIcon, Box, Flex, Text } from "@chakra-ui/react";
import { MdLens } from "react-icons/md"; // This is an example icon from 'react-icons'
import { inter } from "@/app/fonts";

interface StatsListProps {
  iterations: number;
  contributors: number;
  totalArchives: number;
  totalMints: number;
  lyxBurned: number;
}

const MainStatsList: React.FC<StatsListProps> = ({
  iterations,
  contributors,
  totalArchives,
  totalMints,
  lyxBurned,
}) => {
  const bulletColor = "#FE005B";

  return (
    <Box p={"15px 14%"} w={"100%"}>
      <List spacing={1}>
        {[
          { label: "Iterations:", value: iterations.toLocaleString() },
          { label: "Contributors:", value: contributors.toLocaleString() },
          {
            label: "Archive Mints:",
            value: `${totalArchives.toLocaleString()} / ${totalMints.toLocaleString()}`,
          },
          { label: "LYX Burned:", value: `${lyxBurned} LYX` },
        ].map((item, index) => (
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
              >
                <ListIcon as={MdLens} color={bulletColor} mr="2" />
                {item.label}
              </Text>
              <Text
                as="span"
                textAlign="right"
                fontWeight={800}
                fontSize="16px"
                lineHeight="26px"
                fontFamily={inter.style.fontFamily}
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
