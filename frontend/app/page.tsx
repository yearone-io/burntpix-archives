"use client";
import styles from "./page.module.css";
import "./globals.css";
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { New_Rocker } from "next/font/google";
import BurntPixArt from "@/components/BurntPixArt";
import Archives from "@/components/Archives";
import WalletConnector from "@/components/wallet/WalletConnector";
import Article from "@/components/Article";
import MainStatsList from "@/components/MainStatsList";
import RefineButton from "@/components/RefineButton";
import Leaderboard from "@/components/Leaderboard";
import EditorsNote from "@/components/EditorsNote";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { BurntPixArchives__factory } from "@/contracts";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { divideBigIntTokenBalance } from "@/utils/numberUtils";
import YourContributions from "@/components/YourContributions";

const newRockerFont = New_Rocker({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Home() {
  const walletContext = useContext(WalletContext);
  const { account, networkConfig, provider } = walletContext;

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  // immutables
  const [burntPicId, setBurntPicId] = useState<string>("--");
  const [winnerIterations, setWinnerIterations] = useState<string>("--");
  const [supplyCap, setSupplyCap] = useState<number>(0);

  const [iterations, setIterations] = useState<string>("--");
  const [contributors, setContributors] = useState<string>("--");
  const [archiveMints, setArchiveMints] = useState<string>("--");
  const [lyxBurned, setLyxBurned] = useState<string>("--");


  const archivesTitle = (
    <Box
      color="#FE005B"
      fontWeight={900}
      fontSize="md"
      lineHeight="17px"
      letterSpacing={1.5}
      fontFamily={inter.style.fontFamily}
    >
      ARCHIVES
      <Link isExternal={true} href={"/"}>
        <IconButton
          aria-label="View archives"
          color={"lukso.pink"}
          icon={<FaExternalLinkAlt />}
          size="sm"
          variant="ghost"
        />
      </Link>
    </Box>
  );

  const mainStats = [
    { label: "Iterations:", value: iterations },
    { label: "Contributors:", value: contributors },
    { label: "Archive Mints::", value: archiveMints },
    { label: "LYX Burned:", value: lyxBurned },
  ];

  const fetchCollectionCurrentSupply = async (maxSupply: number) => {
    const totalSupply = await burntPixArchives.totalSupply();
    setArchiveMints(`${new Intl.NumberFormat('en-US').format(Number(totalSupply))} / ${new Intl.NumberFormat('en-US').format(maxSupply)}`);
  };

  const fetchCollectionStats = async () => {
    await fetchCollectionCurrentSupply(supplyCap);
    const iterations = await burntPixArchives.getTotalIterations();
    const contributors = await burntPixArchives.getTotalContributors();
    const lyxBurned = await burntPixArchives.getTotalFeesBurnt();

    setIterations(iterations.toString());
    setContributors(contributors.toString());
    setLyxBurned(`${divideBigIntTokenBalance(lyxBurned, 18).toString()} LYX`);
  };


  useEffect(() => {
    const fetchImmutableStats = async () => {
      const burntPicId = await burntPixArchives.burntPicId();
      const winnerIterations = await burntPixArchives.winnerIters();
      const supplyCap = await burntPixArchives.tokenSupplyCap();
      setBurntPicId(burntPicId);
      setWinnerIterations(new Intl.NumberFormat('en-US').format(Number(winnerIterations)));
      setSupplyCap(Number(supplyCap));
    };

    fetchImmutableStats();
  }, []);

  useEffect(() => {
    fetchCollectionStats();
  }, [supplyCap]);

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} maxW={"2000px"} p={"0px 25px"}>
        <header>
          <Flex
            flexDir={{
              base: "column",
              md: "row",
            }}
            justifyContent="center"
            alignItems="center"
            width={"100%"}
          >
            <Flex flex="1" justifyContent="flex-end"></Flex>
            <Flex
              flex="2"
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Heading
                as="h1"
                fontFamily={newRockerFont.style.fontFamily}
                m="0"
                p="0"
              >
                Burnt Pix Archives
              </Heading>
              <Heading fontSize="m" as="h3" m="0" p="0">
                ON THE{" "}
                <Heading fontSize="m" as="span" color="lukso.pink">
                  LUKSO
                </Heading>{" "}
                CHAIN
              </Heading>
            </Flex>
            <Flex flex="1" justifyContent="flex-end">
              <Box>
                <WalletConnector />
              </Box>
            </Flex>
          </Flex>
        </header>
        <Box mt={4} pl={"20px"} pr={"20px"} width={"100%"}>
          <Box width="100%">
            <Divider mb={2} borderColor={"#000000"} opacity={1} />
            <Flex justifyContent="center" alignItems="center" w="100%">
              <Box flex="1" textAlign="left" pl={"20px"}>
                <Text color="#000000" fontWeight="400">
                  All the Pixels, That Are Fit To Burn
                </Text>
              </Box>
              <Box flex="0" minWidth="max-content" px={5}>
                <Text as="b">{formattedDate}</Text>
              </Box>
              <Box flex="1" textAlign="right" pr={"20px"}>
                <Text color="#000000" fontWeight="400">
                  {`To Unlock Original Contribute: ${winnerIterations} Iterations`}
                </Text>
              </Box>
            </Flex>
            <Divider  opacity={1} borderColor={"#00000"} size={"lg"} />
          </Box>
          <Grid width={"100%"} mt="20px" templateColumns={{ base: "4fr 9fr", md: "9fr 4fr"}}>
            <GridItem
              borderRight={{ base: "none", md: "1px solid #000000" }}
              pb="20px"
            >
              <Flex direction={{ base: "column", md: "row" }}>
                <Box flex="1" minW={"300px"}>
                  <Article
                    title="LIVE VIEW"
                    description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together"
                  >
                    <Box p="20px 10%" w="100%">
                      <MainStatsList stats={mainStats} />
                    </Box>
                    <RefineButton />
                  </Article>
                </Box>
                <Flex
                  flex="1"
                  minW="fit-content"
                  mt={{ base: 4, md: 0 }}
                  justifyContent="center"
                >
                  <BurntPixArt />
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <EditorsNote />
            </GridItem>
          </Grid>
          <Divider borderColor={"#00000"} size={"md"} />
          <Grid width={"100%"} templateColumns={{ base: "1fr", md: "9fr 4fr"}}>
            <GridItem w="100%" overflow={"hidden"}>
              <Flex
                flexDir="column"
                borderRight={{ base: "none", md: "1px solid #000000" }}
              >
                <Box >
                  <Article title={archivesTitle}>
                    <Archives />
                  </Article>
                </Box>
                <Divider borderColor={"#00000"} size={"md"} />
                <Article title="LEADERBOARD">
                  <Leaderboard />
                </Article>
              </Flex>
            </GridItem>
            <GridItem w="100%" overflow={"hidden"}>
              <YourContributions account={account} burntPixArchives={burntPixArchives} />
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </main>
  );
}
