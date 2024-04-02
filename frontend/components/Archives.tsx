import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spacer,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaArrowCircleLeft,
  FaExternalLinkAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "@/components/wallet/WalletContext";
import { hexToText, numberToBytes32 } from "@/utils/hexUtils";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";

interface IArchive {
  id: string;
  image: string;
  ownerName: string;
  ownerAddress: string;
  ownerAvatar: string | undefined;
  isMinted: boolean;
}

const Archives = ({ images }: { images: string[] }) => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider } = walletContext;
  const [archives, setArchives] = useState<IArchive[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  // Use the useBreakpointValue hook to determine the number of images to slide
  const slideAmount = useBreakpointValue({ base: 1, md: 5 }) || 5; // 1 image for base (mobile), 5 for md (tablet) and up

  const nextSlide = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + slideAmount, images.length - 1),
    );
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
      .then((archiveCount) => {
        const fetchedArchives: IArchive[] = [];
        return Promise.all(
          Array.from({ length: Number(archiveCount) }, async (_, i) => {
            const id = numberToBytes32(i + 1);
            const archive = await burntPixArchives.burntArchives(id);
            const owner = await burntPixArchives.tokenOwnerOf(id);
            const ownerProfile = await getProfileData(
              owner,
              networkConfig.rpcUrl,
            );
            fetchedArchives.push({
              id: id,
              image: hexToText(archive.image),
              ownerAddress: owner,
              ownerName: ownerProfile.name,
              ownerAvatar: ownerProfile.profileImage
                ? `${constants.IPFS_GATEWAY}/${ownerProfile.profileImage[0].url.replace("ipfs://", "")}`
                : undefined,
              isMinted: false,
            });
            return archive;
          }),
        ).then((value) => {
          setArchives(fetchedArchives);
        });
      })
      .catch((reason) => {
        console.error("Error fetching archives", reason);
      });
  }, []);

  return (
    <VStack alignItems={"left"} w="100%" pr="20px" pt="20px">
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
        ></IconButton>
        <Flex w={slideAmount === 1 ? "200px" : "100%"}>
          {archives.slice(startIndex, startIndex + slideAmount).map((archive, index) => (
            <VStack alignItems={"left"} key={index} width={slideAmount === 1 ? "100%" : "20%"}>
              <div
                style={{ height: slideAmount === 1 ? "200px" : "100px", width: slideAmount === 1 ? "200px" : "100px" }}
                dangerouslySetInnerHTML={{ __html: archive.image }}
              />
              <Flex>
                <Link
                  href={`${networkConfig.artWebBaseUrl}/${networkConfig.burntPixArchivesAddress}/${archive.id}`}
                  isExternal={true}
                  color={"black"}
                  fontWeight={"500"}
                >
                  #{index + startIndex + 1}
                </Link>
                <Spacer />
                <Link
                  isExternal={true}
                  href={`${networkConfig.profileWebBaseUrl}/${archive.ownerAddress}`}
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
        />
      </HStack>
    </VStack>
  );
};

export default Archives;
