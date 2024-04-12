import React, { useState, useEffect, useCallback, useContext } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { Box, Flex, IconButton, Link, useToast } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { AddressLike } from "ethers";
import Article from "./Article";
import MainStatsList, { StatsItem } from "./MainStatsList";
import Archives, {
  IArchive,
  IFetchArchives,
  IFetchArchivesCount,
} from "./Archives";
import SignInBox from "./SigninBox";
import { BurntPixArchives } from "@/contracts/BurntPixArchives";
import { getNextIterationsGoal } from "@/utils/burntPixUtils";
import { hexToText } from "@/utils/hexUtils";
import { getProfileBasicInfo } from "@/utils/universalProfile";

interface IYourContributionsProps {
  readonly account: string | null;
  readonly burntPixArchives: BurntPixArchives;
}

const YourContributions = ({
  account,
  burntPixArchives,
}: IYourContributionsProps) => {
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, userActionCounter } = walletContext;
  const [userArchives, setUserArchives] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<StatsItem[]>([
    { label: "Iterations:", value: "--" },
    { label: "Archive Unlocks:", value: "--" },
    { label: "Archive Mints:", value: "--" },
    { label: "Iters Till Next Unlock:", value: "--" },
  ]);

  const fetchUserStats = async (account: string) => {
    if (!account) return;
    try {
      const userIterations = await burntPixArchives.getContributions([
        account as AddressLike,
      ]);
      const userArchives = await burntPixArchives.getArchives(account);
      const userOwnedArchiveMints = await burntPixArchives.tokenIdsOf(account);
      const userIterationsGoal = getNextIterationsGoal(
        userArchives.length + 1,
        Number(userIterations[0]),
      );
      setUserArchives(userArchives);
      setUserStats([
        {
          label: "Iterations:",
          value: new Intl.NumberFormat("en-US")
            .format(Number(userIterations[0]))
            .toLocaleString(),
        },
        { label: "Archive Unlocks:", value: userArchives.length },
        { label: "Archive Mints:", value: userOwnedArchiveMints.length },
        {
          label: "Iters Till Next Unlock:",
          value: userIterationsGoal.toLocaleString(),
        },
      ]);
    } catch (error: any) {
      toast({
        title: `Failed to fetch your contribution stats: ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: null,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUserStats(account as string);
  }, [account, userActionCounter]);

  const yourArchivesTitle = (
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
      YOUR ARCHIVES
      <Link
        isExternal={true}
        href={`${networkConfig.marketplaceProfilesURL}/${account}`}
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

  const fetchArchives: IFetchArchives = useCallback(
    async (
      startFrom,
      amount,
      setArchives,
      setLastLoadedIndex,
      contributorProfiles,
      setContributorProfiles,
    ) => {
      if (userArchives.length === 0) {
        return;
      }
      const finalIndex = startFrom + amount - 1;
      const newArchives: IArchive[] = [];
      try {
        for (let i = startFrom; i <= finalIndex; i++) {
          if (i > userArchives.length - 1) {
            break;
          }
          const archive = await burntPixArchives.burntArchives(userArchives[i]);
          let isMinted = false;
          let ownerAddress = archive.creator;
          try {
            ownerAddress = await burntPixArchives.tokenOwnerOf(userArchives[i]);
            isMinted = true;
          } catch (error) {
            console.log(
              `archive ${userArchives[i]} not minted yet or error fetching owner`,
            );
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
            id: userArchives[i],
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
          title: `Failed to fetch your archives: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    },
    [userArchives, account],
  );

  const fetchArchivesCount: IFetchArchivesCount = useCallback(
    async (setArchivesCount) => {
      try {
        setArchivesCount(userArchives.length);
      } catch (error: any) {
        toast({
          title: `Failed to fetch your archives count: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      }
    },
    [userArchives, account],
  );

  return (
    <>
      {account ? (
        <Flex flexDir="column" gap={5}>
          <Article title="YOUR CONTRIBUTIONS">
            <Box p="20px 0px">
              <MainStatsList stats={userStats} />
            </Box>
          </Article>
          <Article title={yourArchivesTitle}>
            <Box pt={6}>
              <Archives
                fetchArchives={fetchArchives}
                fetchArchivesCount={fetchArchivesCount}
              />
            </Box>
          </Article>
        </Flex>
      ) : (
        <Article title="YOUR CONTRIBUTIONS">
          <Flex
            height="100%"
            w="100%"
            alignContent="center"
            justifyContent="center"
          >
            <SignInBox />
          </Flex>
        </Article>
      )}
    </>
  );
};

export default YourContributions;
