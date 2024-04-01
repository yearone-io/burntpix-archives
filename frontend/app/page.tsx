"use client";
import styles from "./page.module.css";
import "./globals.css";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { New_Rocker } from "next/font/google";
import BurntPixArt from "@/components/BurntPixArt";
import Archives from "@/components/Archives";
import WalletConnector from "@/components/wallet/WalletConnector";
import Article from "@/components/Article";
import MainStatsList from "@/components/MainStatsList";
import RefineButton from "@/components/RefineButton";
import Leaderboard from "@/components/leaderBoard";
import EditorsNote from "@/components/EditorsNote";

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

  const mainStats =
    // TODO Generate function that returns the dynamic stats
    [
      { label: "Iterations:", value: "0".toLocaleString() },
      { label: "Contributors:", value: "0".toLocaleString() },
      {
        label: "Archive Mints:",
        value: `${"0".toLocaleString()} / ${"0".toLocaleString()}`,
      },
      { label: "LYX Burned:", value: `${"0"} LYX` },
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

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"}>
        <header>
          <Flex width="100%" alignItems="center">
            <Flex direction="column" alignItems="center">
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
            <Box>
              <WalletConnector />
            </Box>
          </Flex>
        </header>
        <Box mt={4} pl={10} pr={10} width={"100%"} maxW='1400px'>
          <Box>
            <Divider mb={2} borderColor={"#00000"} />
            <Flex justifyContent="space-between" w='100%' >
              <Box>
                <Text pl={10} color="#00000" fontWeight="400">
                  All the Pixels, That Are Fit To Burn
                </Text>
              </Box>
              <Box>
                <Text as={"b"}>{formattedDate}</Text>
              </Box>
              <Box>
                <Text pr={10} color="#00000" fontWeight="400">
                  To Unlock Original Contribute: XX,XX,XXX Iterations
                </Text>
              </Box>
            </Flex>
            <Divider borderColor={"#00000"} size={"lg"} />
          </Box>
          <Flex justifyContent="space-between" w='100%' mt='10px' >
            <Flex p='0 20px 20px 20px' borderRight={"1px solid #000000"} w='60%'>
              <Article
                title="LIVE VIEW"
                description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together"
              >
                {
                  <Box>
                    <MainStatsList stats={mainStats} />
                    <RefineButton />
                  </Box>
                }
              </Article>
              <Box mt={6}>
                <BurntPixArt />
              </Box>
            </Flex>
            <Box  w='30%' p='0 20px'>
              <EditorsNote />
            </Box>
          </Flex>
          
          <Divider borderColor={"#00000"} size={"md"} />
          <Flex justifyContent="space-between" w='100%'>
            <Flex flexDir="column"  borderRight={"1px solid #000000"} w='60%'>
              <Box w='100%'>
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
              </Box>
              <Divider borderColor={"#00000"} size={"md"} />
              <Article title="LEADER BOARD">
                <Leaderboard items={leaderboardFakeStats} />
              </Article>
            </Flex>

            <Flex flexDir="column" w='30%'>
              <Article title="YOUR CONTRIBUTIONS">
                <MainStatsList stats={userStats} />
              </Article>
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
          </Flex>
          </Flex>
        </Box>
      </Flex>
    </main>
  );
}
