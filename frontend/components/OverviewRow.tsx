"use client";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import Article from "./Article";
import MainStatsList, { StatsItem } from "./MainStatsList";
import RefineButton from "./RefineButton";
import BurntPixArt from "./BurntPixArt";
import EditorsNote from "./EditorsNote";

interface IOverviewRowProps {
  readonly collectionStats: StatsItem[];
  readonly burntPicId: string;
}

export const OverviewRow = ({
  collectionStats,
  burntPicId,
}: IOverviewRowProps) => {
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
      w="full"
    >
      <GridItem colSpan={1} px={{ base: 0, md: 7 }} py={7}>
        <Article
          title="LIVE VIEW"
          description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together"
        >
          <Box p="5% 10%">
            <MainStatsList stats={collectionStats} />
          </Box>
          <RefineButton />
        </Article>
      </GridItem>
      <GridItem
        colSpan={1}
        px={{ base: 0, md: 7 }}
        py={7}
        borderRight={{ base: "0px", lg: "1px solid #000000" }}
      >
        <BurntPixArt burntPicId={burntPicId} />
      </GridItem>
      <GridItem
        as={Flex}
        justifyContent={"center"}
        alignItems={"center"}
        colSpan={{ base: 1, md: 2, lg: 1 }}
        px={{ base: 0, md: 7 }}
        py={7}
        borderTop={{ base: "1px solid #000000", lg: "0px" }}
      >
        <EditorsNote />
      </GridItem>
    </Grid>
  );
};
