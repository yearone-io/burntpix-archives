import React, { useContext, useEffect, useState } from "react";
import { Avatar, Flex, Text, Skeleton, useToast } from "@chakra-ui/react";
import { inter } from "@/app/fonts"; // Make sure this import path is correct
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "./wallet/WalletContext";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";
import { ZeroAddress } from "ethers";
import { formatAddress } from "@/utils/tokenUtils";

interface Contribution {
  contributor: string;
  contribution: number;
  upName: string | null;
  avatar: string | null;
}

const Leaderboard: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider, refineEventCounter } = walletContext;
  const [topContributions, setTopContributions] = useState<Contribution[]>([]);
  const [loadingFirstFive, setLoadingFirstFive] = useState(true);
  const [loadingSecondFive, setLoadingSecondFive] = useState(true);

  const truncateName = (name: string) => {
    if (name.length > 20) {
      return name.substring(0, 20) + "...";
    }
    return name;
  };

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    let isMounted = true;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const fetchProfileDataWithDelay = async (
      contributors: string[],
      delayMs: number,
    ) => {
      const profiles = [];
      for (const contrib of contributors) {
        if (!isMounted) return;
        const profile = await fetchProfileData(contrib, networkConfig.rpcUrl);
        profiles.push(profile);
        await delay(delayMs);
      }
      return profiles;
    };

    const fetchContributions = async () => {
      try {
        const [topContributors, contributions] =
          await burntPixArchives.getTopTenContributors();
        if (Number(contributions[0]) === 0 || !isMounted) {
          return;
        }
        const delayMsTime = 150;

        const firstChunk = topContributors.slice(0, 5);
        const secondChunk = topContributors.slice(5);

        const firstChunkProfiles = await fetchProfileDataWithDelay(
          firstChunk,
          delayMsTime,
        );

        if (!isMounted || !firstChunkProfiles) return;

        const firstChunkContributionsWithProfiles = firstChunk
          .filter((contributor) => contributor !== ZeroAddress)
          .map((contributor, index) => ({
            contributor,
            contribution: Number(contributions[index]),
            upName: firstChunkProfiles[index]?.upName || null,
            avatar: firstChunkProfiles[index]?.avatar || null,
          }));
        setTopContributions(firstChunkContributionsWithProfiles);
        setLoadingFirstFive(false);
        const secondChunkProfiles = await fetchProfileDataWithDelay(
          secondChunk,
          delayMsTime,
        );
        if (!isMounted || !secondChunkProfiles) return;
        const secondChunkContributionsWithProfiles = secondChunk
          .filter((contributor) => contributor !== ZeroAddress)
          .map((contributor, index) => ({
            contributor,
            contribution: Number(contributions[index]),
            upName: secondChunkProfiles[index]?.upName || null,
            avatar: secondChunkProfiles[index]?.avatar || null,
          }));

        setTopContributions([
          ...firstChunkContributionsWithProfiles,
          ...secondChunkContributionsWithProfiles,
        ]);
        setLoadingSecondFive(false);
      } catch (error: any) {
        if (isMounted) {
          toast({
            title: `Failed to fetch leaderboard contributions: ${error.message}`,
            status: "error",
            position: "bottom-left",
            duration: null,
            isClosable: true,
          });
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [refineEventCounter]);

  const fetchProfileData = async (
    contributor: string,
    rpcUrl: string,
  ): Promise<{ upName: string | null; avatar: string | null } | null> => {
    try {
      if (contributor === "0x0000000000000000000000000000000000000000") {
        return { upName: null, avatar: null };
      }

      const existingContributor = topContributions.find(
        (c) => c.contributor === contributor,
      );
      // avoid unnecessary api call when refreshing leaderboard
      if (existingContributor) {
        return {
          upName: existingContributor.upName,
          avatar: existingContributor.avatar,
        };
      }

      const profileData = await getProfileData(contributor, rpcUrl);
      let upName = null,
        avatar = null;

      if (profileData) {
        if (profileData.profileImage && profileData.profileImage.length > 0) {
          avatar = `${constants.IPFS_GATEWAY}/${profileData.profileImage[0].url.replace("ipfs://", "")}`;
        }
        upName = profileData.name;
      }

      return { upName, avatar };
    } catch (error) {
      console.error("Error fetching profile data for", contributor, error);
      return null;
    }
  };
  const avatarSize = { base: "18px", md: "24px" };
  const fontSizing = { base: "sm", md: "md", lg: "lg" };
  const renderItem = (item: Contribution, index: number) => {
    const contributorName = item.upName
      ? truncateName(item.upName)
      : formatAddress(item.contributor);
    return (
      <Flex
        key={index}
        alignItems="center"
        justifyContent="space-between"
        p={0.5}
      >
        <Flex alignItems="center" flex="1" gap={16}>
          <Text
            fontSize={fontSizing}
            fontWeight="normal"
            minWidth="20px"
            fontFamily={inter.style.fontFamily}
          >
            {index + 1}.
          </Text>
          <Flex alignItems={"center"} gap={2}>
            {item.avatar !== null && (
              <Avatar
                src={item.avatar}
                height={avatarSize}
                width={avatarSize}
              />
            )}
            <Text
              fontSize={fontSizing}
              fontWeight="normal"
              flex="1"
              fontFamily={inter.style.fontFamily}
            >
              {contributorName}
            </Text>
          </Flex>
        </Flex>
        <Text fontSize={fontSizing} fontWeight="800">
          {item.contribution.toLocaleString()}
        </Text>
      </Flex>
    );
  };

  if (!topContributions.length && !loadingFirstFive && !loadingSecondFive) {
    return (
      <Flex
        height={"120px"}
        alignItems={"center"}
        justifyContent={"center"}
        w="100%"
        px={7}
        gap={3}
      >
        <Text fontSize={"lg"} lineHeight={"lg"} fontWeight={400}>
          Leaderboard is empty
        </Text>
        <Text fontSize={"3xl"} lineHeight={"3xl"}>
          🏆
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      justifyContent="center"
      alignItems={"flex-start"}
      w="100%"
    >
      {loadingFirstFive ? (
        <>
          <Flex
            flexDir={"column"}
            marginRight={{ base: "0", md: "10%" }}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
            mr={"5%"}
          >
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Flex>
        </>
      ) : (
        <>
          <Flex
            flexDir={"column"}
            marginRight={{ base: "0", md: "10%" }}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
          >
            {topContributions.slice(0, 5).map(renderItem)}
          </Flex>
        </>
      )}
      {loadingSecondFive ? (
        <>
          <Flex
            flexDir={"column"}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
          >
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Flex>
        </>
      ) : (
        <>
          {topContributions.slice(5, 10).length ? (
            <Flex
              flexDir={"column"}
              minWidth={{ base: "100%", md: "45%" }}
              gap={3}
            >
              {topContributions
                .slice(5, 10)
                .map((item, index) => renderItem(item, index + 5))}
            </Flex>
          ) : null}
        </>
      )}
    </Flex>
  );
};

export default Leaderboard;
