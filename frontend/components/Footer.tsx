"use client";
import React, { useContext } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { FaSquareGithub } from "react-icons/fa6";
import { formatAddress } from "@/utils/tokenUtils";
import { WalletContext } from "@/components/wallet/WalletContext";
import { getNetworkConfig } from "@/constants/networks";

const Footer: React.FC = () => {
  const displayMobileDesktop = useBreakpointValue({ base: "none", md: "flex" });
  const walletContext = useContext(WalletContext);
  const { networkConfig } = walletContext;

  return (
    <Box as="footer">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        py={8}
        px={{ base: 0, md: 7 }}
        mx={8}
        borderTop="2px"
        borderColor="#000000"
      >
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
          <Flex display={displayMobileDesktop}>
            <Text
              fontSize="md"
              fontFamily={inter.style.fontFamily}
              fontWeight={400}
              letterSpacing={1.5}
            >
              SC: {formatAddress(networkConfig.burntPixArchivesAddress)}
            </Text>
            <Link
              href={
                networkConfig.explorerURL +
                "/address/" +
                networkConfig.burntPixArchivesAddress
              }
              isExternal
              ml="5px"
              size="14px"
              mt="4px"
            >
              <FaExternalLinkAlt />
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
        </Flex>
        <Text
          fontSize="xs"
          fontFamily={inter.style.fontFamily}
          lineHeight="xs"
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
