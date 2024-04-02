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

  const nextSlide = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 5, images.length - 1));
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 5, 0));
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
    <VStack alignItems={"left"}>
      <HStack>
        <Text color={"lukso.pink"} fontSize={"lg"} fontWeight={"900"}>
          ARCHIVES
        </Text>
        <Link isExternal={true} href={"/"}>
          <IconButton
            aria-label="View archives"
            color={"lukso.pink"}
            icon={<FaExternalLinkAlt />}
            size="sm"
            variant="ghost"
          />
        </Link>
      </HStack>
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
        ></IconButton>
        <Flex>
          {archives.slice(startIndex, startIndex + 5).map((archive, index) => (
            <VStack alignItems={"left"} key={index}>
              <div
                style={{ height: "115px", width: "115px" }}
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
        ></IconButton>
      </HStack>
    </VStack>
  );
};

export default Archives;
