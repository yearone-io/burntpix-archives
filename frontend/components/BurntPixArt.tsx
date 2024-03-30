import { Fractal__factory } from "@/contracts";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { HStack, Text, VStack, Link, Spinner, Box } from "@chakra-ui/react";
import { formatAddress } from "@/utils/tokenUtils";

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

      <HStack textAlign={"center"}>
        <Text>Burnt Pix Id</Text>
        <Link
          isExternal={true}
          href={`${networkConfig.burntPixWebUrl}/${networkConfig.burntPixId}`}
        >
          {formatAddress(networkConfig.burntPixId)}
        </Link>
      </HStack>
    </VStack>
  );
}
