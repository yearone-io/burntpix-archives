"use client";
import styles from "./page.module.css";
import "./globals.css";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { New_Rocker } from "next/font/google";
import BurntPixArt from "@/components/BurntPixArt";
import Archives from "@/components/Archives";
import WalletConnector from "@/components/wallet/WalletConnector";

const newRockerFont = New_Rocker({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Home() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} alignItems={"center"}>
      <header >
        <Flex width="100%" alignItems="center">
          <Flex direction="column" alignItems="center">
            <Heading as="h1" fontFamily={newRockerFont.style.fontFamily} m='0' p='0'>
              Burnt Pix Archives
            </Heading>
            <Heading fontSize="m" as="h3" m='0' p='0'>
              ON THE <Heading fontSize="m" as="span" color="lukso.pink">LUKSO</Heading> CHAIN
            </Heading>
          </Flex>
          <Box>
            <WalletConnector />
          </Box>
        </Flex>
      </header>
        <Box mt={4} pl={10} pr={10} width={"100%"}>
          <Divider mb={2} />
          <Flex>
            <Box flex="1">
              <Text pl={10}>All the Pixels, That Are Fit To Burn</Text>
            </Box>
            <Text as={"b"}>{formattedDate}</Text>
            <Text flex="1"></Text>
          </Flex>
          <Divider colorScheme={"blackAlpha"} size={"lg"} />
        </Box>
        <Box>
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
        <Box mt={6}>
          <BurntPixArt />
        </Box>
      </Flex>
    </main>
  );
}
