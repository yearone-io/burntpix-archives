"use client";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Link,
  useToast,
} from "@chakra-ui/react";
import Archives, {
  IArchive,
  IFetchArchives,
  IFetchArchivesCount,
} from "@/components/Archives";
import Article from "@/components/Article";
import Leaderboard from "@/components/Leaderboard";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { BurntPixArchives } from "@/contracts";
import { useCallback, useContext } from "react";
import YourContributions from "@/components/YourContributions";
import { hexToText, numberToBytes32 } from "@/utils/hexUtils";
import { getProfileBasicInfo } from "@/utils/universalProfile";
import { Network } from "@/constants/networks";
import { WalletContext } from "./wallet/WalletContext";

interface IContributionsRowProps {
  readonly account: string | null;
  readonly burntPixArchives: BurntPixArchives;
  readonly networkConfig: Network;
}

export const ContributionsRow = ({
  account,
  burntPixArchives,
  networkConfig,
}: IContributionsRowProps) => {
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { userActionCounter } = walletContext;
  const archivesTitle = (
    <Flex
      color="#FE005B"
      fontWeight={900}
      fontSize="md"
      lineHeight="17px"
      letterSpacing={1.5}
      fontFamily={inter.style.fontFamily}
      alignItems={"center"}
      gap={"2"}
    >
      ARCHIVES
      <Link
        isExternal={true}
        href={`${networkConfig.marketplaceCollectionsURL}/${networkConfig.burntPixArchivesAddress}`}
      >
        <IconButton
          aria-label="View archives"
          color={"lukso.pink"}
          icon={<FaExternalLinkAlt />}
          size="xs"
          variant="ghost"
          mb={"2px"}
        />
      </Link>
    </Flex>
  );
  const externalFetchArchives: IFetchArchives = useCallback(
    async (
      startFrom,
      amount,
      setArchives,
      setLastLoadedIndex,
      contributorProfiles,
      setContributorProfiles,
    ) => {
      try {
        const archiveCount = Number(await burntPixArchives.archiveCount());
        if (archiveCount === 0) {
          return;
        }
        const finalIndex = startFrom + amount - 1;
        const newArchives: IArchive[] = [];
        for (let i = startFrom; i <= finalIndex; i++) {
          if (i > archiveCount - 1) {
            break;
          }
          const id = numberToBytes32(i + 1);
          const archive = await burntPixArchives.burntArchives(id);
          let isMinted = false;
          let ownerAddress = archive.creator;
          try {
            ownerAddress = await burntPixArchives.tokenOwnerOf(id);
            isMinted = true;
          } catch (error) {
            console.log(`archive ${id} not minted yet or error fetching owner`);
          }

          let ownerProfile = contributorProfiles[ownerAddress];
          // Check if the profile is not already fetched
          if (!ownerProfile) {
            ownerProfile = await getProfileBasicInfo(
              ownerAddress,
              networkConfig.rpcUrl,
            );
            setContributorProfiles((prevProfiles) => ({
              ...prevProfiles,
              [ownerAddress]: ownerProfile,
            }));
          }
          newArchives.push({
            id,
            image: hexToText(archive.image),
            ownerAddress,
            ownerName: ownerProfile.upName,
            ownerAvatar: ownerProfile.avatar,
            isMinted,
          });
        }

        setArchives((prevArchives) => {
          const all = [...(Array.isArray(prevArchives) ? prevArchives : [])];
          for (const archive of newArchives) {
            const oldIndex = all.findIndex((t) => t.id === archive.id);
            if (oldIndex !== -1) {
              all[oldIndex] = {
                ...archive,
              };
            } else {
              all.push(archive);
            }
          }
          return all;
        });
        setLastLoadedIndex(finalIndex);
      } catch (error: any) {
        toast({
          title: `Failed to fetch archives: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [userActionCounter],
  );

  const fetchArchivesCount: IFetchArchivesCount = useCallback(
    async (setArchivesCount) => {
      try {
        const archivesCount = Number(await burntPixArchives.archiveCount());
        setArchivesCount(archivesCount);
      } catch (error: any) {
        toast({
          title: `Failed to fetch collection archives count: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    },
    [userActionCounter],
  );
  return (
    <Grid w={"full"} templateColumns={{ base: "1fr", lg: "2fr 1fr" }}>
      <GridItem
        colSpan={1}
        borderRight={{ base: "none", lg: "1px solid #000000" }}
        borderTop={"1px solid #000000"}
      >
        <Box py={7} px={{ base: 0, md: 7 }} borderBottom={"1px solid #000000"}>
          <Article title={archivesTitle}>
            <Box pt={6}>
              <Archives
                fetchArchives={externalFetchArchives}
                fetchArchivesCount={fetchArchivesCount}
              />
            </Box>
          </Article>
        </Box>
        <Box py={7} px={{ base: 0, md: 7 }}>
          <Article title="LEADERBOARD">
            <Box pt={6}>
              <Leaderboard />
            </Box>
          </Article>
        </Box>
      </GridItem>
      <GridItem
        colSpan={1}
        px={{ base: 0, md: 7 }}
        py={7}
        borderTop={"1px solid #000000"}
      >
        <YourContributions
          account={account}
          burntPixArchives={burntPixArchives}
        />
      </GridItem>
    </Grid>
  );
};
