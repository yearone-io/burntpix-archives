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
import Archives, { IArchive, IFetchArchives } from "@/components/Archives";
import Article from "@/components/Article";
import Leaderboard from "@/components/Leaderboard";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { BurntPixArchives } from "@/contracts";
import { useCallback } from "react";
import YourContributions from "@/components/YourContributions";
import { hexToText, numberToBytes32 } from "@/utils/hexUtils";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";
import { Network } from "@/constants/networks";

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
  const toast = useToast();
  const externalFetchArchives: IFetchArchives = useCallback(
    async (
      startFrom,
      amount,
      setArchives,
      setLoadedIndices,
      ownerProfiles,
      setOwnerProfiles,
    ) => {
      try {
        const archiveCount = await burntPixArchives.archiveCount();
        const count = Number(archiveCount);
        const end = Math.min(startFrom + amount, count);
        const newArchives: IArchive[] = [];

        for (let i = startFrom; i < end; i++) {
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

          let ownerProfile = ownerProfiles[ownerAddress];
          if (!ownerProfile) {
            // Check if the profile is not already fetched
            try {
              ownerProfile = await getProfileData(
                ownerAddress,
                networkConfig.rpcUrl,
              );
            } catch (error: any) {
              ownerProfile = { name: "EOA" };
            }
            setOwnerProfiles((prevProfiles) => ({
              ...prevProfiles,
              [ownerAddress]: ownerProfile,
            }));
          }
          let ownerAvatar;

          if (ownerProfile.profileImage && ownerProfile.profileImage.length) {
            ownerAvatar = `${constants.IPFS_GATEWAY}/${ownerProfile.profileImage[0].url.replace("ipfs://", "")}`;
          }

          newArchives.push({
            id,
            image: hexToText(archive.image),
            ownerAddress,
            ownerName: ownerProfile.name,
            ownerAvatar,
            isMinted,
          });
        }

        setArchives((prevArchives) => [
          ...(Array.isArray(prevArchives) ? prevArchives : []),
          ...newArchives,
        ]);
        setLoadedIndices(end);
      } catch (error: any) {
        toast({
          title: `Failed to fetch archives: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    },
    [
      /* dependencies */
    ],
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
            <Archives fetchArchives={externalFetchArchives} />
          </Article>
        </Box>
        <Box py={7} px={{ base: 0, md: 7 }}>
          <Article title="LEADERBOARD">
            <Leaderboard />
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
