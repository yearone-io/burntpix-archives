"use client";
import "../app/globals.css";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import WalletConnector from "@/components/wallet/WalletConnector";
import { ptSerifNormal, interBold, newRockerFont } from "@/app/fonts";
import HowItWorks from "@/components/HowItWorks";

interface IHeaderProps {
  winnerIterations: string;
}

export const Header = ({ winnerIterations }: IHeaderProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header>
      <Flex
        flexDir={{
          base: "column-reverse",
          md: "row",
        }}
        justifyContent="center"
        alignItems={{
          base: "center",
          md: "flex-start",
        }}
        width={"100%"}
      >
        <Flex flex="1" alignItems="center" justifyContent="center">
          <Box marginTop={{ base: 6, md: 0 }}>
            <HowItWorks />
          </Box>
        </Flex>
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
            fontWeight={400}
            fontSize="4.95rem"
            lineHeight="4.95rem"
            textAlign={"center"}
          >
            Burnt Pix Archives
          </Heading>
          <Flex gap={"2"} alignItems={"center"}>
            <Heading
              as="h3"
              fontSize="sm"
              fontStyle={interBold.style.fontStyle}
              m="0"
              p="0"
              letterSpacing={"1px"}
              style={{ wordSpacing: "2px" }}
            >
              ON THE
            </Heading>
            <Heading
              as={Image}
              color="lukso.pink"
              height={"0.8rem"}
              src="/images/LUKSO_Wordmark_Fuchsia.svg"
              alt="LUKSO"
            />
            <Heading
              as="h3"
              fontSize="sm"
              fontStyle={interBold.style.fontStyle}
              m="0"
              p="0"
              letterSpacing={"1.5px"}
            >
              CHAIN
            </Heading>
          </Flex>
        </Flex>
        <Flex flex="1" justifyContent="flex-end">
          <Box
            marginBottom={{
              base: "3",
              md: "0px",
            }}
            marginRight={{ base: 0, md: "6" }}
          >
            <WalletConnector />
          </Box>
        </Flex>
      </Flex>
      <Flex
        mt={"7"}
        borderTop={"1px solid #000000"}
        borderBottom={"2px solid #000000"}
        flexDir={{
          base: "column",
          md: "row",
        }}
        justifyContent="center"
        alignItems="center"
        width={"100%"}
        py={"1"}
        px={"6"}
      >
        <Box flex="1">
          <Text
            color="#000000"
            fontFamily={ptSerifNormal.style.fontFamily}
            fontSize={"md"}
          >
            "All the Pixels, That Are Fit To Burn"
          </Text>
        </Box>
        <Box flex="0" minWidth="max-content" px={5}>
          <Text fontSize={"1.2rem"} as="b">
            {formattedDate}
          </Text>
        </Box>
        <Flex flex="1" justifyContent={"flex-end"} textAlign={"center"}>
          <Text
            color="#000000"
            fontFamily={ptSerifNormal.style.fontFamily}
            fontSize={"md"}
          >
            {`To Unlock Original Contribute: ${winnerIterations} Iterations`}
          </Text>
        </Flex>
      </Flex>
    </header>
  );
};
