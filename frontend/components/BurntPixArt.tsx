import { BurntPixArchives, Fractal__factory } from "@/contracts";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import {
  HStack,
  Text,
  VStack,
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
  readonly burntPicId: string;
}

export default function BurntPixArt({ burntPicId }: IOriginalArtProps) {
  const [burntPix, setBurntPix] = useState<string | undefined>();
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider } = walletContext;

  useEffect(() => {
    const fetchBurntPix = async () => {
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
          duration: 5000,
          isClosable: true,
        });
      }
    };
    burntPicId && fetchBurntPix();
  }, [burntPicId]);

  return (
    <VStack alignItems={"left"}>
      <Box width={320} height={320}>
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

      <HStack justifyContent={"center"}>
        <Text
          fontSize="sm"
          fontWeight="500"
          letterSpacing={1.5}
          fontFamily={inter.style.fontFamily}
        >
          Burnt Pix Id
        </Text>
        <Link
          isExternal={true}
          href={`${networkConfig.originalBurntPicUrl}/${burntPicId}`}
        >
          <Flex>
            <Text
              fontSize="sm"
              fontWeight="500"
              letterSpacing={1.5}
              fontFamily={inter.style.fontFamily}
              mr="2px"
            >
              {formatAddress(burntPicId)}
            </Text>
            <Text fontSize={"12px"} ml="2px" mt="4px">
              <FaExternalLinkAlt />
            </Text>
          </Flex>
        </Link>
      </HStack>
    </VStack>
  );
}
