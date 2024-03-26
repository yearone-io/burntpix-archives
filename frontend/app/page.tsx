"use client";
import styles from "./page.module.css";
import "./globals.css";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { New_Rocker } from "next/font/google";

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
        <header>
          <Flex direction={"column"} alignItems={"center"}>
            <Heading as={"h1"} fontFamily={newRockerFont.style.fontFamily}>
              Burnt Pix Archives
            </Heading>
            <Heading fontSize={"m"} as={"h3"}>
              ON THE{" "}
              <Heading fontSize={"m"} as={"span"} color={"lukso.pink"}>
                LUKSO
              </Heading>{" "}
              CHAIN
            </Heading>
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
      </Flex>
    </main>
  );
}
