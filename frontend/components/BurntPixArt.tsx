import { Fractal__factory } from "@/contracts";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import {
  Text,
  Link,
  Box,
  Flex,
  Stack,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { formatAddress } from "@/utils/tokenUtils";
import { inter } from "@/app/fonts";
import { FaExternalLinkAlt } from "react-icons/fa";

interface IOriginalArtProps {
  readonly burntPicId?: string;
}

export default function BurntPixArt({ burntPicId }: IOriginalArtProps) {
  const [burntPix, setBurntPix] = useState<string | undefined>();
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider, userActionCounter } = walletContext;

  useEffect(() => {
    const fetchBurntPix = async () => {
      if (!burntPicId) return;
      try {
        const burntPixFractal = Fractal__factory.connect(
          burntPicId.replace("000000000000000000000000", ""),
          provider,
        );
        const image = await burntPixFractal.image();
        setBurntPix(image);
        burntPixFractal;
      } catch (error: any) {
        toast({
          title: `Failed to fetch burntpix original image: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    };
    fetchBurntPix();
  }, [burntPicId, userActionCounter]);

  return (
    <Flex
      width={"100%"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box width={"100%"} minWidth={"xs"} maxWidth={"sm"}>
        {burntPix ? (
          <div
            style={{ height: "100%", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: burntPix }}
          />
        ) : (
          <Stack>
            <Skeleton height="75px" />
            <Skeleton height="75px" />
            <Skeleton height="75px" />
            <Skeleton height="75px" />
          </Stack>
        )}
      </Box>

      <Flex mt={1} alignItems={"center"} gap={1}>
        <Text
          fontSize="sm"
          fontWeight="500"
          letterSpacing={1.5}
          fontFamily={inter.style.fontFamily}
        >
          Burnt Pic Id:
        </Text>
        <Link
          isExternal={true}
          href={`${networkConfig.marketplaceCollectionsURL}/${networkConfig.burntPixCollectionAddress}/${burntPicId}`}
        >
          <Flex alignItems={"center"} gap={1}>
            <Text
              fontSize="sm"
              fontWeight="500"
              letterSpacing={1.5}
              fontFamily={inter.style.fontFamily}
              mr="2px"
            >
              {burntPicId ? formatAddress(burntPicId) : "--"}
            </Text>
            <Box>
              <FaExternalLinkAlt />
            </Box>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
}
