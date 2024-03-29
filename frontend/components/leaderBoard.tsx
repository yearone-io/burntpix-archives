import React from "react";
import { Box, Avatar, Flex, Text, Grid } from "@chakra-ui/react";

interface LeaderboardItemProps {
  name: string;
  avatar: string;
  score: number;
}

interface LeaderboardProps {
  items: LeaderboardItemProps[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ items }) => {
  // Split the items into two columns
  const columnOneItems = items.slice(0, 5);
  const columnTwoItems = items.slice(5, 10);

  const renderItem = (item: LeaderboardItemProps, index: number) => (
    <Flex key={index} alignItems="center" justifyContent="space-between" p={2}>
      <Flex alignItems="center">
        <Text fontSize="md" fontWeight="bold" minWidth="10px" mr="2">
          {index + 1}.
        </Text>
        <Avatar name={item.name} src={item.avatar} size="sm" mr="2" />
        <Text fontSize="md" fontWeight="normal">
          {item.name}
        </Text>
      </Flex>
      <Text fontSize="md" fontWeight="semibold">
        {item.score.toLocaleString()}
      </Text>
    </Flex>
  );

  return (
    <Box p="20px" w="full">
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box>{columnOneItems.map(renderItem)}</Box>
        <Box>
          {columnTwoItems.map((item, index) => renderItem(item, index + 5))}
        </Box>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
