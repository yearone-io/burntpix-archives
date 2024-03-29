import React from "react";
import { Box, Flex, Text, Link, IconButton, Select } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { inter } from "@/app/fonts";
import { FaSquareGithub } from "react-icons/fa6";
import { getNetworkConfig } from "@/constants/networks";

const Footer: React.FC = () => {
  return (
    <Box as="footer" w="full">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        p={8}
        m={"0 20px"}
        borderTop="1px"
        borderColor="#000000"
      >
        {/* Left side: Lukso Mainnet and SC */}
        <Flex alignItems="center">
          <Box minWidth={"170"} mr="20px">
            <Select
              defaultValue={process.env.NEXT_PUBLIC_DEFAULT_NETWORK!}
              onChange={(event) =>
                (window.location.href = getNetworkConfig(
                  event.target.value,
                ).baseUrl)
              }
            >
              <option value={"mainnet"}>LUKSO Mainnet</option>
              <option value={"testnet"}>LUKSO Testnet</option>
            </Select>
          </Box>
          <Text
            fontSize="14px"
            fontFamily={inter.style.fontFamily}
            fontWeight={400}
            letterSpacing={1.5}
          >
            SC: 0xd4E...Fa2
          </Text>
          <Link href="#" isExternal ml="5px" size="14px" mb="4px">
            <ExternalLinkIcon />
          </Link>
          <Link
            href="https://github.com/yearone-io/burntpix-archives"
            isExternal
            ml="20px"
            fontSize="24px"
          >
            <FaSquareGithub />
          </Link>
        </Flex>

        {/* Right side: Built by */}
        <Text
          fontSize="10px"
          fontFamily={inter.style.fontFamily}
          lineHeight="12px"
          fontWeight={500}
          letterSpacing={1.5}
        >
          built by
          <Link
            href="https://twitter.com/YearOneIO"
            textDecoration="underline"
            target="blank"
          >
            @yearoneio
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
