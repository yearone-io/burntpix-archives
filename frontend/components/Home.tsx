"use client";
import styles from "../app/page.module.css";
import "../app/globals.css";
import { Flex, useToast } from "@chakra-ui/react";
import { StatsItem } from "@/components/MainStatsList";
import { BurntPixArchives__factory } from "@/contracts";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { divideBigIntTokenBalance } from "@/utils/numberUtils";
import { Header } from "./Header";
import { OverviewRow } from "./OverviewRow";
import { ContributionsRow } from "./ContributionsRow";

export default function Home() {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider, account } = walletContext;
  const toast = useToast();

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  // immutables
  const [burntPicId, setBurntPicId] = useState<string>("");
  const [winnerIterations, setWinnerIterations] = useState<string>("--");
  const [supplyCap, setSupplyCap] = useState<number>(0);

  const [collectionStats, setCollectionStats] = useState<StatsItem[]>([
    { label: "Iterations:", value: "--" },
    { label: "Contributors:", value: "--" },
    { label: "Archive Mints:", value: "--" },
    { label: "LYX Burned:", value: "--" },
  ]);

  const fetchCollectionStats = async () => {
    try {
      const [totalSupply, iterations, contributors, lyxBurned] =
        await Promise.all([
          burntPixArchives.totalSupply(),
          burntPixArchives.getTotalIterations(),
          burntPixArchives.getTotalContributors(),
          burntPixArchives.getTotalFeesBurnt(),
        ]);
      setCollectionStats([
        { label: "Iterations:", value: iterations.toLocaleString() },
        { label: "Contributors:", value: contributors.toLocaleString() },
        {
          label: "Archive Mints:",
          value: `${new Intl.NumberFormat("en-US").format(Number(totalSupply))} / ${new Intl.NumberFormat("en-US").format(supplyCap)}`,
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
    const fetchImmutableStats = async () => {
      try {
        const [burntPicId, winnerIterations, supplyCap] = await Promise.all([
          burntPixArchives.burntPicId(),
          burntPixArchives.winnerIters(),
          burntPixArchives.tokenSupplyCap(),
        ]);
        setBurntPicId(burntPicId);
        setWinnerIterations(
          new Intl.NumberFormat("en-US").format(Number(winnerIterations)),
        );
        setSupplyCap(Number(supplyCap));
      } catch (error: any) {
        toast({
          title: `Failed to fetch collection constants: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    };

    fetchImmutableStats();
  }, []);

  useEffect(() => {
    supplyCap && fetchCollectionStats();
  }, [supplyCap]);

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} maxW={"2000px"} px={8}>
        <Header winnerIterations={winnerIterations} />
        <OverviewRow
          collectionStats={collectionStats}
          burntPicId={burntPicId}
        />
        <ContributionsRow
          account={account}
          burntPixArchives={burntPixArchives}
          networkConfig={networkConfig}
        />
      </Flex>
    </main>
  );
}
