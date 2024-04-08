import React, { useState, useEffect, useCallback, useContext } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { Box, Flex, IconButton, Link, useToast } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { AddressLike } from "ethers";
import Article from "./Article";
import MainStatsList, { StatsItem } from "./MainStatsList";
import Archives, { IArchive, IFetchArchives } from "./Archives";
import SignInBox from "./SigninBox";
import { BurntPixArchives } from "@/contracts/BurntPixArchives";
import { getNextIterationsGoal } from "@/utils/burntPixUtils";
import { hexToText } from "@/utils/hexUtils";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";

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
  const { networkConfig, refineEventCounter } = walletContext;
  const [userArchives, setUserArchives] = useState<string[]>([]);
  const [userOwnedArchiveMints, setUserOwnedArchiveMints] = useState<string[]>(
    [],
  );
  const [userStats, setUserStats] = useState<StatsItem[]>([
    { label: "Iterations:", value: "--" },
    { label: "Archive Unlocks:", value: "--" },
    { label: "Archive Mints:", value: "--" },
    { label: "Iters Till Next Archive:", value: "--" },
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
      setUserOwnedArchiveMints(userOwnedArchiveMints); // todo?? do we need this?
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
          label: "Iters Till Next Archive:",
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
  }, [account, refineEventCounter]);

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

  const externalFetchArchives: IFetchArchives = useCallback(
    async (
      startFrom,
      amount,
      setArchives,
      setLoadedIndices,
      ownerProfiles,
      setOwnerProfiles,
    ) => {
      const end = Math.min(startFrom + amount, userArchives.length);
      const newArchives: IArchive[] = [];
      try {
        for (let i = startFrom; i < end; i++) {
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
            id: userArchives[i],
            image: hexToText(archive.image),
            ownerAddress,
            ownerName: ownerProfile.name,
            ownerAvatar,
            isMinted,
          });
        }

        setArchives((prevArchives) => {
          let all = [
            ...(Array.isArray(prevArchives) ? prevArchives : []),
            ...newArchives,
          ];
          // unique by id
          all = all.filter(
            (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
          );
          return all;
        });
        setLoadedIndices(end);
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
    [userArchives],
  );

  return (
    <>
      {account ? (
        <Flex flexDir="column">
          <Article title="YOUR CONTRIBUTIONS">
            <Box p="20px 0px">
              <MainStatsList stats={userStats} />
            </Box>
          </Article>
          <Article title={yourArchivesTitle}>
            <Archives fetchArchives={externalFetchArchives} />
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
