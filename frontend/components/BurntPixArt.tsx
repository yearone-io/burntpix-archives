import { Fractal__factory } from "@/contracts";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { HStack, Text, VStack, Link, Spinner, Box, Flex } from "@chakra-ui/react";
import { formatAddress } from "@/utils/tokenUtils";
import { inter } from "@/app/fonts";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function BurntPixArt() {
  const [burntPix, setBurntPix] = useState<string | undefined>();
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider } = walletContext;
  const burntPixFractal = Fractal__factory.connect(
    networkConfig.burntPixId,
    provider,
  );

  useEffect(() => {
    const fetchBurntPix = async () => {
      const image = await burntPixFractal.image();
      setBurntPix(image);
    };
    fetchBurntPix();
  }, []);
  return (
    <VStack alignItems={"left"}>
      <Box width={320} height={320}>
        {burntPix ? (
          <div
            style={{ height: "100%", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: burntPix }}
          />
        ) : (
          <Spinner width={"100%"} height={"100%"} />
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
          href={`${networkConfig.burntPixWebUrl}/${networkConfig.burntPixId}`}
        >
          <Flex>
           <Text
                     fontSize="sm"
                     fontWeight="500"
                     letterSpacing={1.5}
                     fontFamily={inter.style.fontFamily}
            mr='2px'>{formatAddress(networkConfig.burntPixId)}</Text>
            <Text fontSize={'12px'} ml='2px' mt='4px'>           
              <FaExternalLinkAlt/>
            </Text>
          </Flex>

        </Link>
      </HStack>
    </VStack>
  );
}
