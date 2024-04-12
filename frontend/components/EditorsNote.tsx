import { Box, Text, Link } from "@chakra-ui/react";
import React from "react";
import { inter } from "@/app/fonts";

const EditorsNote = ({ winningIterations }: { winningIterations: string }) => {
  return (
    <Box
      fontFamily={inter.style.fontFamily}
      minW="xs"
      width="100%"
      lineHeight="tall"
    >
      <Text fontSize="sm" fontWeight={400} lineHeight="15px" marginBottom="2">
        <Text as="span" fontWeight={900} letterSpacing={1.5}>
          Editor’s Note:
        </Text>{" "}
        is a fully onchain collaborative NFT art project built on top of the
        original {" "}
        <Link
          href="https://burntpix.com"
          textDecoration="underline"
          target="blank"
        >
          Burnt Pix
        </Link>{" "}
        collection by{" "}
        <Link
          href="https://twitter.com/peter_szilagyi/status/1721812235163521452"
          textDecoration="underline"
          target="blank"
        >
          Péter Szilágyi
        </Link>
        . In the spirit of the original this project is merely an artistic
        showcase of its creators’ programming prowess. Feel free to become part
        of the collection, but look at it as art, not as something to speculate
        on. no updates, no fixes, no core team or community, no promises. The
        Burnt Pix Archives are provided as is.
      </Text>
      <Text fontSize="sm" fontWeight={400} lineHeight="15px" marginBottom="2">
        The core idea behind the Archives is to encourage the LUKSO community to
        refine the same Burnt Pix NFT together. Conceptually we do this by
        rewarding the refiners of the NFT with the ability to mint lower
        resolution LSP8 "archives" of the original at various stages in the
        original’s evolution. The refiners unlock new archive levels of
        increasing difficulty through their contributions. The amount of
        possible minted archives, aka Burnt Pix Archives’ NFT max supply, is
        limited to one thousand. Additionally, the refiner that first
        contributes {winningIterations} iterations to the archive unlocks the
        original NFT for their use. Hope you enjoy the outcome as much as we’ve
        enjoyed building it. We burn together, we rise together!
      </Text>
    </Box>
  );
};

export default EditorsNote;
