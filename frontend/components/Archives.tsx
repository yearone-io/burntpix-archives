import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaCheckCircle,
} from "react-icons/fa";
import { WalletContext } from "@/components/wallet/WalletContext";
import { LSP3ProfileMetadata } from "@lukso/lsp3-contracts";
import { bytes32ToNumber } from "@/utils/hexUtils";
import { BurntPixArchives__factory } from "@/contracts";

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
    setLastLoadedIndex: React.Dispatch<React.SetStateAction<number>>,
    ownerProfiles: { [key: string]: any },
    setOwnerProfiles: React.Dispatch<
      React.SetStateAction<{ [key: string]: any }>
    >,
  ): Promise<void>;
}

export interface IFetchArchivesCount {
  (
    setArchivesCount: React.Dispatch<React.SetStateAction<number | undefined>>,
  ): Promise<void>;
}

interface IOwners {
  [key: string]: LSP3ProfileMetadata;
}

interface ArchivesProps {
  fetchArchives: IFetchArchives;
  fetchArchivesCount: IFetchArchivesCount;
}

const Archives: React.FC<ArchivesProps> = ({
  fetchArchivesCount,
  fetchArchives,
}) => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider, refineEventCounter } = walletContext;
  const [archivesCount, setArchivesCount] = useState<number>();
  const [archives, setArchives] = useState<IArchive[]>();
  const [startIndex, setStartIndex] = useState(0);
  const [slideAmount, setSlideAmount] = useState<number>(0);
  const [lastLoadedIndex, setLastLoadedIndex] = useState<number>(0);
  const [ownerProfiles, setOwnerProfiles] = useState<IOwners>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const archiveContainerWidth = 130;
  const archiveContainerGap = 24;
  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setSlideAmount(
          Math.floor(
            entry.contentRect.width /
              (archiveContainerWidth + archiveContainerGap),
          ),
        );
      }
    });

    if (carouselRef.current) {
      resizeObserver.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        resizeObserver.unobserve(carouselRef.current);
      }
    };
  }, [carouselRef]);

  useEffect(() => {
    fetchArchivesCount(setArchivesCount);
  }, [fetchArchivesCount, refineEventCounter]);

  useEffect(() => {
    slideAmount &&
      fetchArchives(
        startIndex,
        slideAmount,
        setArchives as Dispatch<SetStateAction<IArchive[]>>,
        setLastLoadedIndex,
        ownerProfiles,
        setOwnerProfiles,
      );
  }, [fetchArchives, slideAmount]);

  const mintArchive = async (archiveId: string) => {
    try {
      const signer = await provider.getSigner();
      await burntPixArchives
        .connect(signer)
        ["mintArchive(bytes32)"](archiveId);
    } catch (error: any) {
      console.error(`Failed to mint archive: ${error.message}`);
    }
  }

  const nextSlide = () => {
    if (archivesCount === undefined) return;
    setStartIndex((prevStartIndex) => {
      const nextStartIndex = prevStartIndex + slideAmount;
      if (nextStartIndex > archivesCount - 1) {
        return prevStartIndex;
      }
      if (
        nextStartIndex + slideAmount > lastLoadedIndex &&
        lastLoadedIndex < archivesCount - 1
      ) {
        fetchArchives(
          nextStartIndex,
          slideAmount,
          setArchives as Dispatch<SetStateAction<IArchive[]>>,
          setLastLoadedIndex,
          ownerProfiles,
          setOwnerProfiles,
        );
      }
      return nextStartIndex;
    });
  };

  const prevSlide = () => {
    setStartIndex((prevStartIndex) =>
      Math.max(prevStartIndex - slideAmount, 0),
    );
  };

  const archiveSkeleton = () => (
    <Flex flexDir={"column"} justifyContent={"center"} width={"100%"}>
      <Skeleton width={"100%"} height={`${archiveContainerWidth + 20}px`} />
    </Flex>
  );

  const archiveContainer = (archive: IArchive, index: number) => (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      key={index}
      width={`${archiveContainerWidth}px`}
      gap={2}
    >
      <Box
        height={`${archiveContainerWidth}px`}
        width={`${archiveContainerWidth}px`}
        filter={archive.isMinted ? "none" : "invert(100%)"}
        dangerouslySetInnerHTML={{ __html: archive.image }}
      />
      <Flex
        width={`${archiveContainerWidth}px`}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {archive.id && archive.isMinted ? (
          <Link
            href={`${networkConfig.marketplaceCollectionsURL}/${networkConfig.burntPixArchivesAddress}/${archive.id}`}
            fontSize={"md"}
            isExternal={true}
            color={"black"}
            fontWeight={"500"}
          >
            {`#${bytes32ToNumber(archive.id)}`}
          </Link>
        ) : (
          <Text color={"black"} fontSize={"md"} fontWeight={"500"}>
            {`#${bytes32ToNumber(archive.id)}`}
          </Text>
        )}
        <Flex alignItems={"center"} gap={1}>
          <Button variant="ghost" size="sm" onClick={mintArchive}>
            Mint
          </Button>
          {archive.isMinted && (
            <>
              <Link
                isExternal={true}
                href={
                  archive.ownerAddress
                    ? `${networkConfig.marketplaceProfilesURL}/${archive.ownerAddress}`
                    : undefined
                }
              >
                <Avatar
                  name={archive.ownerName ? archive.ownerName : undefined}
                  src={archive.ownerAvatar ? archive.ownerAvatar : undefined}
                  height={"24px"}
                  width={"24px"}
                />
              </Link>
              <Icon ml={1} as={FaCheckCircle} boxSize={"18px"} />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );

  const nextArchivesBatch =
    archives && archives.length
      ? archives.slice(startIndex, startIndex + slideAmount)
      : [];
  return (
    <Flex alignItems={"center"} justifyContent={"center"} w="100%">
      <IconButton
        icon={<FaArrowCircleLeft />}
        onClick={prevSlide}
        aria-label={"Previous"}
        isDisabled={startIndex <= 0}
        backgroundColor={"transparent"}
      />
      <Flex
        w={"100%"}
        ref={carouselRef}
        alignItems={"center"}
        justifyContent={
          !!nextArchivesBatch.length && nextArchivesBatch.length < slideAmount
            ? "flex-start"
            : "center"
        }
        gap={`${archiveContainerGap}px`}
      >
        {archivesCount === 0 ? (
          <Flex
            height={"120px"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={3}
          >
            <Text fontSize={"lg"} lineHeight={"lg"} fontWeight={400}>
              New archives will appear here
            </Text>
            <Text fontSize={"3xl"} lineHeight={"3xl"}>
              📂
            </Text>
          </Flex>
        ) : nextArchivesBatch.length ? (
          nextArchivesBatch.map(archiveContainer)
        ) : (
          archiveSkeleton()
        )}
      </Flex>
      <IconButton
        onClick={nextSlide}
        icon={<FaArrowCircleRight />}
        aria-label={"Next"}
        isDisabled={
          archivesCount === undefined ||
          startIndex + slideAmount >= archivesCount
        }
        backgroundColor={"transparent"}
      />
    </Flex>
  );
};

export default Archives;
