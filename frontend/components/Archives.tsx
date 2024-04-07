import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
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
  const { networkConfig, provider } = walletContext;
  const [archives, setArchives] = useState<IArchive[]>();
  const [startIndex, setStartIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<number>(0);
  const [ownerProfiles, setOwnerProfiles] = useState<IOwners>({});

  // Use the useBreakpointValue hook to determine the number of images to slide
  const responsiveSlideValues = { base: 3, md: 5 };
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
  }, [fetchArchives, slideAmount]);

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
        <Flex w={slideAmount === responsiveSlideValues.base ? "200px" : "100%"}>
          {archives
            .slice(startIndex, startIndex + slideAmount)
            .map((archive, index) => (
              <VStack
                alignItems={"left"}
                key={index}
                width={
                  slideAmount === responsiveSlideValues.base ? "100%" : "20%"
                }
              >
                <div
                  style={{
                    height:
                      slideAmount === responsiveSlideValues.base
                        ? "200px"
                        : "100px",
                    width:
                      slideAmount === responsiveSlideValues.base
                        ? "200px"
                        : "100px",
                    filter: archive.isMinted ? "none" : "invert(100%)",
                  }}
                  dangerouslySetInnerHTML={{ __html: archive.image }}
                />
                <Flex
                  width={
                    slideAmount === responsiveSlideValues.base
                      ? "200px"
                      : "100px"
                  }
                >
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
