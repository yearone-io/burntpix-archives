import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spacer,
  VStack,
  useBreakpointValue,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { FaArrowCircleLeft, FaCheckCircle } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "@/components/wallet/WalletContext";
import { hexToText, numberToBytes32 } from "@/utils/hexUtils";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";

interface IArchive {
  id: string;
  image: string;
  ownerName?: string;
  ownerAddress?: string;
  ownerAvatar?: string;
  isMinted: boolean;
}

const Archives = () => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider } = walletContext;
  const [archives, setArchives] = useState<IArchive[] | undefined>();
  const [startIndex, setStartIndex] = useState(0);

  // Use the useBreakpointValue hook to determine the number of images to slide
  const slideAmount = useBreakpointValue({ base: 1, md: 5 }) || 5; // 1 image for base (mobile), 5 for md (tablet) and up

  const nextSlide = () => {
    setStartIndex((prevIndex) => {
      return Math.min(prevIndex + slideAmount, archives!.length - 1);
    });
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - slideAmount, 0));
  };

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    burntPixArchives
      .archiveCount()
      .then(async (archiveCount) => {
        const fetchedArchives: IArchive[] = [];
        await Promise.all(
          Array.from({ length: Number(archiveCount) }, async (_, i) => {
            const id = numberToBytes32(i + 1);
            const archive = await burntPixArchives.burntArchives(id);
            let isMinted = false;
            let ownerAddress = archive.creator;
            try {
              ownerAddress = await burntPixArchives.tokenOwnerOf(id);
              isMinted = true;
            } catch (reason: any) {
              if (reason.message.includes("LSP8NonExistentTokenId")) {
                console.log(`token ${id} not minted yet`);
              } else {
                console.error("Error fetching owner", reason);
                throw reason;
              }
            }

            const ownerProfile = await getProfileData(
              ownerAddress,
              networkConfig.rpcUrl,
            );

            const ownerName = ownerProfile.name;
            let ownerAvatar = undefined;

            if (ownerProfile.profileImage && ownerProfile.profileImage.length) {
              ownerAvatar = `${constants.IPFS_GATEWAY}/${ownerProfile.profileImage[0].url.replace("ipfs://", "")}`;
            }

            fetchedArchives.push({
              id: id,
              image: hexToText(archive.image),
              ownerAddress: ownerAddress,
              ownerName: ownerName,
              ownerAvatar: ownerAvatar,
              isMinted: isMinted,
            });
          }),
        );
        setArchives(fetchedArchives.sort((a, b) => a.id.localeCompare(b.id)));
      })
      .catch((reason) => {
        console.error("Error fetching archives", reason);
      });
  }, []);

  if (archives === undefined) {
    return (
      <Stack mr="20px">
        <Skeleton height="30px" />
        <Skeleton height="30px" />
        <Skeleton height="30px" />
        <Skeleton height="30px" />
      </Stack>
    );
  }
  return (
    <VStack alignItems={"left"} w="100%" pr="20px" pt="20px">
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
          isDisabled={startIndex <= 0}
          backgroundColor={"transparent"}
        ></IconButton>
        <Flex w={slideAmount === 1 ? "200px" : "100%"}>
          {archives
            .slice(startIndex, startIndex + slideAmount)
            .map((archive, index) => (
              <VStack
                alignItems={"left"}
                key={index}
                width={slideAmount === 1 ? "100%" : "20%"}
              >
                <div
                  style={{
                    height: slideAmount === 1 ? "200px" : "100px",
                    width: slideAmount === 1 ? "200px" : "100px",
                    filter: archive.isMinted ? "none" : "invert(100%)",
                  }}
                  dangerouslySetInnerHTML={{ __html: archive.image }}
                />
                <Flex width={slideAmount === 1 ? "200px" : "100px"}>
                  <Link
                    href={
                      archive.id
                        ? `${networkConfig.artWebBaseUrl}/${networkConfig.burntPixArchivesAddress}/${archive.id}`
                        : undefined
                    }
                    isExternal={true}
                    color={"black"}
                    fontWeight={"500"}
                  >
                    #{index + startIndex + 1}
                  </Link>
                  <Spacer />
                  <Link
                    isExternal={true}
                    href={
                      archive.ownerAddress
                        ? `${networkConfig.profileWebBaseUrl}/${archive.ownerAddress}`
                        : undefined
                    }
                  >
                    <Avatar
                      name={archive.ownerName}
                      src={archive.ownerAvatar}
                      height={"24px"}
                      width={"24px"}
                    />
                  </Link>
                  {archive.isMinted && (
                    <Icon ml={1} as={FaCheckCircle} boxSize={"24px"} />
                  )}
                </Flex>
              </VStack>
            ))}
        </Flex>
        <IconButton
          onClick={nextSlide}
          icon={<FaArrowCircleRight />}
          aria-label={"Next"}
          isDisabled={startIndex + slideAmount >= archives!.length}
          backgroundColor={"transparent"}
        />
      </HStack>
    </VStack>
  );
};

export default Archives;
