import { Box, Text, Link } from "@chakra-ui/react";
import React from "react";
import { inter } from "@/app/fonts";

const EditorsNote: React.FC = () => {
  return (
    <Box
      m="20px"
      w="405px"
      fontFamily={inter.style.fontFamily}
      lineHeight="tall"
    >
      <Text fontSize="sm" fontWeight={400} lineHeight="15px" marginBottom="2">
        <Text as="span" fontWeight={900} letterSpacing={1.5}>
          Editor’s Note:
        </Text>{" "}
        The Burnt Pix Archives is project built on top of the original{" "}
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
        on. There will be no updates, no fixes, no community, no nothing. The
        Burnt Pix Archives are provided as is.
      </Text>
      <Text fontSize="sm" fontWeight={400} lineHeight="15px" marginBottom="2">
        The core idea behind Burnt Pix Archives is to encourage the Luxo
        community to work together and refine the same Burnt Pix NFT.
        Conceptually we do this by rewarding the refiners of the NFT with lower
        resolution LSP8 "archives" of the same original at various stages in its
        evolution as the refiners unlock new levels through their contributions.
        The amount of possible minted archives is limited to ten thousand. The
        refiner that first contributes 69,420,000 iterations to the archive
        unlocks the original NFT for their use.
      </Text>
    </Box>
  );
};

export default EditorsNote;
