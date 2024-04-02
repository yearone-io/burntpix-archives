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
import Leaderboard from "@/components/leaderBoard";
import EditorsNote from "@/components/EditorsNote";
import { FaExternalLinkAlt } from "react-icons/fa";

const newRockerFont = New_Rocker({
  weight: ["400"],
  subsets: ["latin"],
});

const leaderboardFakeStats = [
  {
    name: "Tehnalogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 134778,
  },
  {
    name: "Demagogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 100778,
  },
  {
    name: "Crazygogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 50778,
  },
  {
    name: "Ledergogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 44778,
  },
  {
    name: "Eggplantgogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 10000,
  },
  {
    name: "GravygogoGOGOGOGOGOGOGOGOOGGOGOGOS",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 9999,
  },
  {
    name: "LSPgogos",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 7000,
  },
  {
    name: "0x",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 3000,
  },
  {
    name: "0x",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    score: 333,
  },
];

export default function Home() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const yourArchivesTitle = (
    <Text>
      YOUR ARCHIVES
      <Link isExternal={true} href={"/"}>
        <IconButton
          aria-label="View archives"
          color={"lukso.pink"}
          icon={<FaExternalLinkAlt />}
          size="sm"
          variant="ghost"
        />
      </Link>
    </Text>
  );

  const archivesTitle = (
    <Text>
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
    </Text>
  );

  const mainStats =
    // TODO Generate function that returns the dynamic stats
    [
      { label: "Iterations:", value: "3330".toLocaleString() },
      { label: "Contributors:", value: "230".toLocaleString() },
      {
        label: "Archive Mints:",
        value: `${"324230".toLocaleString()} / ${"423420".toLocaleString()}`,
      },
      { label: "LYX Burned:", value: `${"4232340"} LYX` },
    ];

  const userStats =
    // TODO Generate function that returns the dynamic stats
    [
      { label: "Iterations:", value: "0".toLocaleString() },
      { label: "Archive Unlocks:", value: "0".toLocaleString() },
      {
        label: "Archive Mints:",
        value: "0".toLocaleString(),
      },
      { label: "Iters Till Next Archive:", value: "0".toLocaleString() },
    ];
  const gridTemplateColumns = { base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" };

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} maxW={"2000px"}>
        <header>
          <Flex
            flexDir={{
              base: "column",
              md: "row",
            }}
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            pr="20px"
            pl="20px"
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
            <Divider mb={2} borderColor={"#00000"} />
            <Flex justifyContent="center" alignItems="center" w="100%">
              <Box flex="1" textAlign="left" pl={10}>
                <Text color="#000000" fontWeight="400">
                  All the Pixels, That Are Fit To Burn
                </Text>
              </Box>
              <Box flex="0" minWidth="max-content" px={5}>
                <Text as="b">{formattedDate}</Text>
              </Box>
              <Box flex="1" textAlign="right" pr={10}>
                <Text color="#000000" fontWeight="400">
                  To Unlock Original Contribute: XX,XX,XXX Iterations
                </Text>
              </Box>
            </Flex>
            <Divider borderColor={"#00000"} size={"lg"} />
          </Box>
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr" }}
            gap={2}
            mt="20px"
            ml="20px"
            mr="20px"
          >
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
                    <MainStatsList stats={mainStats} />
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
          <Grid templateColumns={gridTemplateColumns}>
            <GridItem w="2/3" mr="20px">
              <Flex
                flexDir="column"
                borderRight={{ base: "none", md: "1px solid #000000" }}
              >
                <Box w="100%" ml="20px">
                  <Article title={archivesTitle}>
                    <Archives
                      images={[
                        "https://http.cat/100",
                        "https://http.cat/200",
                        "https://http.cat/201",
                        "https://http.cat/202",
                        "https://http.cat/400",
                        "https://http.cat/500",
                        "https://http.cat/501",
                        "https://http.cat/502",
                        "https://http.cat/503",
                      ]}
                    />
                  </Article>
                </Box>
                <Divider borderColor={"#00000"} size={"md"} />
                <Box ml="20px">
                  <Article title="LEADER BOARD">
                    <Leaderboard items={leaderboardFakeStats} />
                  </Article>
                </Box>
              </Flex>
            </GridItem>
            <GridItem w="1/3">
              <Flex flexDir="column">
                <Article title="YOUR CONTRIBUTIONS">
                  <MainStatsList stats={userStats} />
                </Article>
                <Article title={yourArchivesTitle}>
                  <Archives
                    images={[
                      "https://http.cat/100",
                      "https://http.cat/200",
                      "https://http.cat/201",
                      "https://http.cat/202",
                      "https://http.cat/400",
                      "https://http.cat/500",
                      "https://http.cat/501",
                      "https://http.cat/502",
                      "https://http.cat/503",
                    ]}
                  />
                </Article>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </main>
  );
}
