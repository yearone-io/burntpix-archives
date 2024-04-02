import React from "react";
import { Grid, Box, Text, List, ListItem } from "@chakra-ui/react";
import { MdLens } from "react-icons/md";
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
    <Box p="20px 10%" w="100%">
      <List spacing={1}>
        {stats.map((item, index) => (
          <ListItem key={index}>
            {/* Setting up the grid with two columns: one for the label and icon, another for the value */}
            <Grid templateColumns="repeat(2, 1fr)" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center">
                <Box as={MdLens} color={bulletColor} mr="2" size="9px" />
                <Text
                  as="span"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="26px"
                  fontFamily={inter.style.fontFamily}
                  letterSpacing="1.5"
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
                fontSize="16px"
                lineHeight="26px"
                fontFamily={inter.style.fontFamily}
                letterSpacing="1.5"
              >
                {item.value}
              </Text>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MainStatsList;
