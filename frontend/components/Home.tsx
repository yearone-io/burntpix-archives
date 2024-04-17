"use client";
import styles from "../app/page.module.css";
import "../app/globals.css";
import { Flex, useDisclosure, useToast } from "@chakra-ui/react";
import { BurntPixArchives__factory } from "@/contracts";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { Header } from "./Header";
import { OverviewRow } from "./OverviewRow";
import { ContributionsRow } from "./ContributionsRow";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  const walletContext = useContext(WalletContext);
  const { account, networkConfig, provider } = walletContext;
  const toast = useToast();
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  const [burntPicId, setBurntPicId] = useState<string>();
  const [winnerIterations, setWinnerIterations] = useState<string>("--");

  useEffect(() => {
    const fetchImmutableStats = async () => {
      try {
        const [burntPicId, winnerIterations] = await Promise.all([
          burntPixArchives.burntPicId(),
          burntPixArchives.winnerIters(),
        ]);
        setBurntPicId(burntPicId);
        setWinnerIterations(
          new Intl.NumberFormat("en-US").format(Number(winnerIterations)),
        );
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
        <OverviewRow
          burntPicId={burntPicId}
          winningIterations={winnerIterations}
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
