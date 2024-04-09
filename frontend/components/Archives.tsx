import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Avatar,
  Box,
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
  Text,
} from "@chakra-ui/react";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaCheckCircle,
} from "react-icons/fa";
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "@/components/wallet/WalletContext";
import { LSP3ProfileMetadata } from "@lukso/lsp3-contracts";

export interface IArchive {
  id: string;
  image: string;
  ownerName?: string;
  ownerAddress?: string;
  ownerAvatar?: string;
  isMinted: boolean;
}

export interface IFetchArchives {
  (
    startFrom: number,
    amount: number,
    setArchives: React.Dispatch<React.SetStateAction<IArchive[]>>,
    setLoadedIndices: React.Dispatch<React.SetStateAction<number>>,
    ownerProfiles: { [key: string]: any },
    setOwnerProfiles: React.Dispatch<
      React.SetStateAction<{ [key: string]: any }>
    >,
  ): Promise<void>;
}

interface IOwners {
  [key: string]: LSP3ProfileMetadata;
}

interface ArchivesProps {
  fetchArchives: IFetchArchives;
}

const Archives: React.FC<ArchivesProps> = ({ fetchArchives }) => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider, refineEventCounter } = walletContext;
  const [archives, setArchives] = useState<IArchive[]>();
  const [startIndex, setStartIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<number>(0);
  const [ownerProfiles, setOwnerProfiles] = useState<IOwners>({});

  // Use the useBreakpointValue hook to determine the number of images to slide
  const responsiveSlideValues = { base: 3, lg: 5 };
  const slideAmount = useBreakpointValue(responsiveSlideValues) || 5;

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    // Use the passed-in fetchArchives function with necessary arguments
    fetchArchives(
      startIndex,
      slideAmount,
      setArchives as Dispatch<SetStateAction<IArchive[]>>,
      setLoadedIndices,
      ownerProfiles,
      setOwnerProfiles,
    );
  }, [fetchArchives, slideAmount, refineEventCounter]);

  const nextSlide = () => {
    setStartIndex((prevIndex) => {
      const nextIndex = Math.min(prevIndex + slideAmount, loadedIndices - 1);
      if (
        nextIndex + slideAmount > loadedIndices &&
        loadedIndices < Number(burntPixArchives.archiveCount())
      ) {
        fetchArchives(
          startIndex,
          slideAmount,
          setArchives as Dispatch<SetStateAction<IArchive[]>>,
          setLoadedIndices,
          ownerProfiles,
          setOwnerProfiles,
        );
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - slideAmount, 0));
  };

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

  const archiveBox = (archive: IArchive, index: number) => (
    <VStack key={index}>
      <Box
        height={{ base: "200px", lg: "115px" }}
        width={{ base: "200px", lg: "115px" }}
        filter={archive.isMinted ? "none" : "invert(100%)"}
        dangerouslySetInnerHTML={{ __html: archive.image }}
      />
      <Flex width={{ base: "200px", lg: "115px" }}  alignItems={"center"} justifyContent={"space-between"}>
        {archive.id && archive.isMinted ? (
          <Link
            href={`${networkConfig.marketplaceCollectionsURL}/${networkConfig.burntPixArchivesAddress}/${archive.id}`}
            fontSize={"md"}
            isExternal={true}
            color={"black"}
            fontWeight={"500"}
          >
            #{index + startIndex + 1}
          </Link>
        ) : (
          <Text color={"black"} fontSize={"md"} fontWeight={"500"}>
            #{index + startIndex + 1}
          </Text>
        )}
        <Flex alignItems={"center"} gap={1}>
        <Link
          isExternal={true}
          href={
            archive.ownerAddress
              ? `${networkConfig.marketplaceProfilesURL}/${archive.ownerAddress}`
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
          <Icon ml={1} as={FaCheckCircle} boxSize={"18px"} />
        )}
        </Flex>
      </Flex>
    </VStack>
  );

  return archives.length ? (
    <VStack alignItems={"left"} w="100%" pr="20px" pt="20px">
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
          isDisabled={startIndex <= 0}
          backgroundColor={"transparent"}
        />
        <Flex w={"100%"}>
          {archives.slice(startIndex, startIndex + slideAmount).map(archiveBox)}
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
  ) : (
    <Flex
      height={"120px"}
      alignItems={"center"}
      justifyContent={"center"}
      w="100%"
      px={7}
      gap={3}
    >
      <Text fontSize={"lg"} lineHeight={"lg"} fontWeight={400}>
        New archives will appear here
      </Text>
      <Text fontSize={"3xl"} lineHeight={"3xl"}>
        📂
      </Text>
    </Flex>
  );
};

export default Archives;
