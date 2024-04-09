import React from "react";
import { Grid, Box, Text, List, ListItem } from "@chakra-ui/react";
import { MdLens } from "react-icons/md";
import { inter } from "@/app/fonts";

export interface StatsItem {
  label: string;
  value: string | number;
}

export interface StatsListProps {
  stats: StatsItem[];
}

const MainStatsList: React.FC<StatsListProps> = ({ stats }) => {
  const bulletColor = "#FE005B";
  const fontSizing = { base: "sm", md: "md", lg: "lg" };

  return (
    <List spacing={1}>
      {stats.map((item, index) => (
        <ListItem key={index}>
          {/* Setting up the grid with two columns: one for the label and icon, another for the value */}
          <Grid templateColumns="repeat(2, 1fr)" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center">
              <Box as={MdLens} color={bulletColor} mr="2" size="0.8rem" />
              <Text
                as="span"
                fontWeight="500"
                fontSize={fontSizing}
                lineHeight={fontSizing}
                fontFamily={inter.style.fontFamily}
                letterSpacing="1.5px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {item.label}
              </Text>
            </Box>
            <Text
              as="span"
              textAlign="right"
              fontWeight="800"
              fontSize={fontSizing}
              lineHeight={fontSizing}
              fontFamily={inter.style.fontFamily}
              letterSpacing="1.5"
            >
              {item.value}
            </Text>
          </Grid>
        </ListItem>
      ))}
    </List>
  );
};

export default MainStatsList;
