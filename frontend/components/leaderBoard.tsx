import React from "react";
import { Box, Avatar, Flex, Text, Grid } from "@chakra-ui/react";
import { inter } from "@/app/fonts"; // Make sure this import path is correct

interface LeaderboardItemProps {
  name: string;
  avatar: string;
  score: number;
}

interface LeaderboardProps {
  items: LeaderboardItemProps[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ items }) => {
  const truncateName = (name: string) => {
    if (name.length > 10) {
      return name.substring(0, 10) + "...";
    }
    return name;
  };

  const renderItem = (item: LeaderboardItemProps, index: number) => (
    <Flex key={index} alignItems="center" justifyContent="space-between" p={0.5}>
      <Flex alignItems="center" flex="1">
        <Text
          fontSize="md"
          fontWeight="normal"
          minWidth="20px"
          mr="50px"
          fontFamily={inter.style.fontFamily}
        >
          {index + 1}.
        </Text>
        <Avatar
          name={truncateName(item.name)}
          src={item.avatar}
          height="16px"
          width="16px"
        />
        <Text
          fontSize="md"
          fontWeight="normal"
          ml="3"
          mr="50px"
          flex="1"
          fontFamily={inter.style.fontFamily}
          isTruncated // This ensures the name doesn't push the score out of view
        >
          {truncateName(item.name)}
        </Text>
      </Flex>
      <Box textAlign="left" minW="80px"> {/* Ensure a minimum width for alignment */}
        <Text fontSize="md" fontWeight="bold">
          {item.score.toLocaleString()}
        </Text>
      </Box>
    </Flex>
  );

  // Split the items into two columns
  const columnOneItems = items.slice(0, 5);
  const columnTwoItems = items.slice(5, 10);

  return (
    <Box p="20px" w="full">
      <Grid templateColumns="repeat(2, 1fr)" gap={10}>
        <Box>{columnOneItems.map(renderItem)}</Box>
        <Box>
          {columnTwoItems.map((item, index) => renderItem(item, index + 5))}
        </Box>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
