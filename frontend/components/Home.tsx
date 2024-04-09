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
  const { account, networkConfig, provider, refineEventCounter } =
    walletContext;
  const toast = useToast();
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  // immutables
  const [burntPicId, setBurntPicId] = useState<string>("");
  const [winnerIterations, setWinnerIterations] = useState<string>("--");
  const [supplyCap, setSupplyCap] = useState<number>(0);

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

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} maxW={"2000px"} px={8}>
        <Header winnerIterations={winnerIterations} />
        <OverviewRow supplyCap={supplyCap} burntPicId={burntPicId} />
        <ContributionsRow
          account={account}
          burntPixArchives={burntPixArchives}
          networkConfig={networkConfig}
        />
      </Flex>
    </main>
  );
}
