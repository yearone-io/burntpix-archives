"use client";
import { Box, Flex, Grid, GridItem, useToast } from "@chakra-ui/react";
import Article from "./Article";
import MainStatsList, { StatsItem } from "./MainStatsList";
import RefineButton from "./RefineButton";
import BurntPixArt from "./BurntPixArt";
import EditorsNote from "./EditorsNote";
import { useContext, useEffect, useState } from "react";
import { divideBigIntTokenBalance } from "@/utils/numberUtils";
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "@/components/wallet/WalletContext";

interface IOverviewRowProps {
  readonly burntPicId?: string;
  readonly winningIterations: string;
}

export const OverviewRow = ({
  burntPicId,
  winningIterations,
}: IOverviewRowProps) => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider, refineEventCounter } = walletContext;
  const toast = useToast();
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );
  const [collectionStats, setCollectionStats] = useState<StatsItem[]>([
    { label: "Iterations:", value: "--" },
    { label: "Contributors:", value: "--" },
    { label: "Archive Mints:", value: "--" },
    { label: "LYX Burned:", value: "--" },
  ]);

  const fetchCollectionStats = async () => {
    try {
      const [totalSupply, iterations, contributors, lyxBurned, tokenSupplyCap] =
        await Promise.all([
          burntPixArchives.totalSupply(),
          burntPixArchives.getTotalIterations(),
          burntPixArchives.getTotalContributors(),
          burntPixArchives.getTotalFeesBurnt(),
          burntPixArchives.tokenSupplyCap(),
        ]);

      setCollectionStats([
        { label: "Iterations:", value: iterations.toString() },
        { label: "Contributors:", value: contributors.toString() },
        {
          label: "Archive Mints:",
          value: `${new Intl.NumberFormat("en-US").format(Number(totalSupply))} / ${new Intl.NumberFormat("en-US").format(tokenSupplyCap)}`,
        },
        {
          label: "LYX Burned:",
          value: `${divideBigIntTokenBalance(lyxBurned, 18).toString()} LYX`,
        },
      ]);
    } catch (error: any) {
      toast({
        title: `Failed to fetch collection stats: ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: null,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    burntPicId && fetchCollectionStats();
  }, [burntPicId, refineEventCounter]);

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
      w="full"
    >
      <GridItem colSpan={1} pl={{ base: 0, md: 7 }} py={7}>
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
        <EditorsNote winningIterations={winningIterations} />
      </GridItem>
    </Grid>
  );
};
